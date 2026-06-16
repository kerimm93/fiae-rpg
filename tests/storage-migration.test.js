const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
let appScript = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)][0][1];
appScript = appScript.replace(/\ninitApp\(\);\s*$/, '\n');

function createHarness(options = {}) {
  const local = new Map();
  const stores = new Map();
  const localStorage = {
    getItem: key => local.has(key) ? local.get(key) : null,
    setItem: (key, value) => local.set(key, String(value)),
    removeItem: key => local.delete(key)
  };

  const db = {
    objectStoreNames: { contains: name => stores.has(name) },
    createObjectStore(name) { if (!stores.has(name)) stores.set(name, new Map()); },
    transaction(name) {
      const tx = { error: null, oncomplete: null, onerror: null, onabort: null };
      tx.objectStore = () => ({
        get(key) {
          const request = { result: undefined, error: null, onsuccess: null, onerror: null };
          queueMicrotask(() => {
            request.result = stores.get(name).get(key);
            if (request.onsuccess) request.onsuccess();
          });
          return request;
        },
        put(value, key) {
          stores.get(name).set(key, structuredClone(value));
          queueMicrotask(() => { if (tx.oncomplete) tx.oncomplete(); });
        },
        delete(key) {
          stores.get(name).delete(key);
          queueMicrotask(() => { if (tx.oncomplete) tx.oncomplete(); });
        }
      });
      return tx;
    }
  };

  const indexedDB = options.disableIndexedDB ? undefined : {
    open() {
      const request = { result: db, error: null, onupgradeneeded: null, onsuccess: null, onerror: null };
      queueMicrotask(() => {
        if (!stores.has('appState') && request.onupgradeneeded) request.onupgradeneeded();
        if (request.onsuccess) request.onsuccess();
      });
      return request;
    }
  };

  const element = () => ({
    value: '', checked: false, style: {}, innerHTML: '', textContent: '',
    classList: { add() {}, remove() {}, toggle() {} },
    appendChild() {}, remove() {}, querySelectorAll() { return []; }
  });
  const document = {
    getElementById: () => null,
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: element,
    body: element(),
    execCommand() {}
  };
  const context = {
    console, Promise, Set, Map, Date, JSON, Math, Object, Array, String, Boolean, RegExp,
    parseInt, encodeURIComponent, decodeURIComponent, structuredClone, queueMicrotask,
    localStorage, indexedDB, document,
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    Blob: function Blob() {}, FileReader: function FileReader() {},
    fetch: () => Promise.reject(new Error('fetch is not used in storage tests')),
    setTimeout, clearTimeout, confirm: () => true, prompt: () => null
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(appScript, context, { filename: 'index-inline.js' });
  [
    'updateStats', 'renderTable', 'renderTGrid', 'renderModes', 'updateFilters',
    'syncSkillSortControls', 'ihkRender', 'updateSyncUI', 'gistAutoSyncDebounced', 'toast'
  ].forEach(name => { context[name] = () => {}; });

  return { context, localStorage, stores };
}

function legacyState(level) {
  return {
    skills: [{ id: 's1', name: 'Netzwerke', level }],
    dayTracker: {
      '10.06.2026': {
        diary: 'Test',
        screenshotChatUrl: 'https://chatgpt.com/c/test',
        pipeline: { notionDayCreated: true }
      }
    }
  };
}

async function testLegacyKey(key) {
  const { context, localStorage, stores } = createHarness();
  localStorage.setItem(key, JSON.stringify(legacyState(2)));

  await context.load();

  assert.equal(context.S.skills.length, 1);
  assert.equal(context.S.dayTracker['10.06.2026'].screenshotChatUrl, 'https://chatgpt.com/c/test');
  assert.equal(context.S.dayTracker['10.06.2026'].pipeline.notionDayCreated, true);
  assert.equal(typeof context.S.dayTracker['10.06.2026'].pipeline.ankiCardsCreated, 'boolean');
  assert.ok(stores.get('appState').has('state'));
  assert.equal(localStorage.getItem(key), null);
}

async function testWriteQueue() {
  const { context, localStorage, stores } = createHarness();
  context.S = legacyState(2);
  context._appReady = true;
  const first = context.persistLocalOnly();
  context.S.skills[0].level = 4;
  const second = context.persistLocalOnly();

  await Promise.all([first, second]);

  assert.equal(stores.get('appState').get('state').skills[0].level, 4);
  assert.equal(localStorage.getItem('fi_rpg_v4'), null);
}


async function testWritesBlockedBeforeReady() {
  const { context, localStorage, stores } = createHarness();
  context.console = { error() {}, warn() {}, log() {} };
  let renderCalls = 0;
  context.updateStats = () => { renderCalls += 1; };
  context.S = legacyState(0);

  const directPersist = await context.persistLocalOnly();
  const savePersist = await context.save();

  assert.equal(context._appReady, false);
  assert.equal(directPersist, false);
  assert.equal(savePersist, false);
  assert.equal(renderCalls, 0);
  assert.equal(stores.has('appState'), false);
  assert.equal(localStorage.getItem('fi_rpg_v4'), null);
  assert.equal(localStorage.getItem('fi_rpg_storage_fallback'), null);
}

function testCredentialsStaySeparate() {
  const { context, localStorage } = createHarness();
  localStorage.setItem('fi_gist_token', 'secret-token');
  localStorage.setItem('fi_gist_id', 'gist-id');
  context.S = legacyState(2);

  const payload = context.gistBuildPayload();

  assert.equal(context.gistGetToken(), 'secret-token');
  assert.equal(context.gistGetId(), 'gist-id');
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'fi_gist_token'), false);
  assert.equal(JSON.stringify(payload).includes('secret-token'), false);
}


function testPipelineDefaultsDoNotUseLegacyFlags() {
  const { context } = createHarness();
  const entry = context.dtEnsureEntryDefaults({
    notesDone: true,
    skillsExtracted: true,
    skillsImported: true,
    promptCopied: true,
    screenshotsProcessed: true
  }, '11.06.2026');

  assert.equal(entry.notesDone, true);
  assert.equal(entry.skillsExtracted, true);
  assert.equal(entry.skillsImported, true);
  assert.equal(entry.pipeline.canvasCreated, false);
  assert.equal(entry.pipeline.handoffCompleted, false);
  assert.equal(entry.pipeline.skillsReturnedToFiaeRpg, false);
  assert.ok(Object.values(entry.pipeline).every(value => value === false));
}

async function testImportNormalizesAndPreservesPipeline() {
  const { context } = createHarness();
  context._appReady = true;
  context.wkInit = () => {};
  context.save = async () => true;
  context.persistLocalOnly = async () => true;
  context.wpDays = [];

  await context.applyImportData({
    skills: [{ id: 's1', name: 'Import-Test', level: 1 }],
    dayTracker: {
      '12.06.2026': {
        notesDone: true,
        skillsExtracted: true,
        skillsImported: true
      },
      '13.06.2026': {
        pipeline: {
          notionDayCreated: true,
          ankiCardsImported: true,
          skillsReturnedToFiaeRpg: true
        }
      }
    }
  }, { skipSync: true });

  assert.equal(context.S.dayTracker['12.06.2026'].pipeline.skillsReturnedToFiaeRpg, false);
  assert.equal(context.S.dayTracker['12.06.2026'].pipeline.notionDayCreated, false);
  assert.equal(context.S.dayTracker['13.06.2026'].pipeline.notionDayCreated, true);
  assert.equal(context.S.dayTracker['13.06.2026'].pipeline.ankiCardsImported, true);
  assert.equal(context.S.dayTracker['13.06.2026'].pipeline.skillsReturnedToFiaeRpg, true);
  assert.equal(context.S.dayTracker['13.06.2026'].pipeline.canvasCreated, false);
}

async function testEmergencyFallback() {
  const { context, localStorage } = createHarness({ disableIndexedDB: true });
  context.S = legacyState(3);
  context._appReady = true;
  context.console = { error() {}, warn() {}, log() {} };

  const persisted = await context.persistLocalOnly();

  assert.equal(persisted, false);
  assert.equal(JSON.parse(localStorage.getItem('fi_rpg_v4')).skills[0].level, 3);
  assert.equal(localStorage.getItem('fi_rpg_storage_fallback'), '1');
}

(async () => {
  await testLegacyKey('fi_rpg_v4');
  await testLegacyKey('fi_rpg3');
  await testLegacyKey('fi_rpg2');
  await testWriteQueue();
  await testWritesBlockedBeforeReady();
  testPipelineDefaultsDoNotUseLegacyFlags();
  await testImportNormalizesAndPreservesPipeline();
  testCredentialsStaySeparate();
  await testEmergencyFallback();
  console.log('OK: IndexedDB migration, normalization, ready guard, write queue, pipeline defaults and fallback');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
