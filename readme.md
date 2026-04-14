# ⚔️ FI Skill Tracker

Ein gamifizierter Single-File-Tracker für die Umschulung zum **Fachinformatiker – Anwendungsentwicklung**.
Die App verbindet **Skill-Erfassung**, **KI-gestützte Extraktion**, **RPG-Training**, **Wochenkampagnen**, **Weltenkarten-Fortschritt** und einen **Mitschrieb-Tracker** mit lokalem Speicher und optionalem **GitHub-Gist-Sync**. fileciteturn11file0

---

## Aktueller Stand

Die App ist aktuell als **Single-File-HTML-App** umgesetzt und läuft vollständig im Browser. Der persistente State liegt in einem zentralen `S`-Objekt und wird lokal über `localStorage` gespeichert. Zusätzlich gibt es einen optionalen GitHub-Gist-Sync mit Push, Pull, Merge, Sync-Diagnostik, Konflikt-UI und einem stillen Startup-Sync. fileciteturn11file0

Die App ist funktional deutlich weiter als die frühere README-Version: Neben Tagesabschluss, Training und Weltenkarte gibt es jetzt auch einen **Mitschrieb-Tracker**, **dayTracker-State**, **Skill-Fach-Neuzuordnung**, **Sync-Statusanzeige** und eine sichtbare **Konfliktbehandlung** im Datenbereich. fileciteturn11file0 fileciteturn11file1

---

## 🚀 Hauptfunktionen

### 📜 Tagesabschluss-System

Geführter 5-Schritte-Workflow:

1. Prompt generieren  
2. GPT-Ergebnis einfügen  
3. Abgleich-Prompt erzeugen  
4. Neue Skills speichern  
5. Abschluss

Dabei kann das Unterrichtsdatum explizit gesetzt oder über eine `DATUM:`-Zeile aus dem KI-Ergebnis übernommen werden. Neue Skills werden anschließend direkt in den persistierten Skill-State übernommen. fileciteturn11file0

### ⚔️ Skill-Tracking

Jeder Skill enthält mindestens:
- Name
- Fach
- Kurzbeschreibung
- Datum
- Level
- XP
- Sessions

Die App berechnet daraus Gesamtzahl, Fächeranzahl, Durchschnittslevel, Meister-Skills und einen globalen XP-Fortschritt. fileciteturn11file0

### 🔁 Skill-Fach-Neuzuordnung

In der Skill-Liste kann jedes Skill-Objekt nachträglich einem anderen Fach zugeordnet werden. Dafür gibt es ein Select mit vorhandenen Fächern und der Option **„Neues Fach…“**. Das aktualisiert anschließend Skill-Filter und Trainingsgrid. fileciteturn11file0

### 🧙 Training-System / RPG-Modi

Vorhandene Modi:
- ⚡ Prüfungsarena
- 🧙 Weiser Mentor
- 🌀 Socratisches Verhör
- 🗡️ Dungeon-Szenario

Zusätzlich lassen sich eigene Trainingsmodi mit Name, Icon, Beschreibung und Prompt-Template anlegen. Plattformen: **Claude Artifact** oder **ChatGPT Dialog**. fileciteturn11file0

### 🌾 Skill Farmer

Der Skill Farmer extrahiert Skills aus:
- Skripten
- Folien
- eigenen Mitschriften
- Aufgabenblättern
- gemischtem Material

Dafür gibt es einen Extraktions-Prompt und einen Abgleich-Prompt gegen die bestehende Skill-Datenbank. fileciteturn11file0

### 🗺️ Wochenkampagne

Ein Wochenplan kann als Text importiert werden. Daraus werden Unterrichtstage erkannt und pro Tag fertige Mitschriebe-Prompts erzeugt. Diese Tagesprompts greifen auf den eingebauten Unterrichts-/Canvas-Prompt zurück. fileciteturn11file0

### 🌍 Weltenkarte

Die Weltenkarte visualisiert Fachbereiche als Dungeons mit Tageszellen. Zustände:
- Nebel
- Erkundet
- Cleared
- Gemeistert

Importierte Unterrichtstage werden Dungeons zugeordnet. Statusänderungen in der Karte synchronisieren sich mit dem Mitschrieb-Tracker (`notesDone`, `skillsExtracted`, `skillsImported`). fileciteturn11file0

### 📓 Mitschrieb-Tracker

Der Mitschrieb-Tracker ist eine eigene Ansicht für alle bekannten Unterrichtstage. Er zeigt pro Datum:
- Bearbeitungsstatus (`offen`, `in arbeit`, `fertig`)
- zugehörige Dungeons / Fächer
- Prompt kopiert
- Mitschrieb fertig
- Skills extrahiert
- Skills importiert
- Tagebuch
- Aktivitätslog

Tage entstehen automatisch aus Stundenplan-/Dungeon-Importen und werden über den dayTracker-State gepflegt. fileciteturn11file0

---

## ☁️ Sync & Datenhaltung

### Lokale Speicherung

Die App speichert ihren Zustand lokal über `localStorage` unter dem Key `fi_rpg_v4`. Der persistente Hauptstate liegt in `S` und enthält aktuell insbesondere:
- `skills`
- `modes`
- `prefs`
- `dungeons`
- `dayTracker`
- `_lastExported` fileciteturn11file0

### GitHub Gist Sync

Es gibt einen optionalen GitHub-Gist-Sync mit:
- Token + Gist-ID in separaten localStorage-Keys
- Auto-Sync (30s Debounce)
- Push / Pull / Merge
- zentralen GitHub-Headern
- Truncation-sicherem Gist-Lesen über `raw_url`
- `_syncInProgress`-Guard
- sichtbarer Sync-Diagnostik im UI
- Konfliktbereich mit Auswahl **lokal / remote** plus Bulk-Vorauswahl **Alle lokal / Alle remote**. fileciteturn11file0

### Sync-Diagnostik

Im Datenbereich werden aktuell angezeigt:
- letzter Sync-Status
- lokal exportierter Stand
- letzter Remote-Zeitstempel
- Diagnose-Grund

Damit lässt sich besser nachvollziehen, ob zuletzt gepusht, gepullt, gemergt, geskippt oder ein Fehler erzeugt wurde. fileciteturn11file0

### Backup / Import / Export

Vorhanden sind:
- CSV Export / Import für Skills
- JSON-Komplettbackup
- JSON-Import

Der JSON-Export enthält neben Skills und Modi auch Dungeons, dayTracker, Preferences, wpDays und `_lastExported`. fileciteturn11file0

---

## 🧠 Konzept

Die App verbindet mehrere Ebenen:

1. **Unterricht erfassen**  
   Unterrichtstage und Fächer werden über Wochenplan und Weltenkarte strukturiert.

2. **Mitschriebe verarbeiten**  
   Pro Tag lässt sich sichtbar nachvollziehen, ob Prompt, Mitschrieb, Extraktion und Import bereits erledigt sind.

3. **Skills aufbauen**  
   Fachbegriffe und Konzepte werden als konkrete Skill-Objekte gespeichert.

4. **Skills trainieren**  
   Das Wissen wird in RPG-artigen Trainingsmodi mit KI wiederholt und bewertet. fileciteturn11file0

---

## 🛠️ Tech Stack

- Single-File Web App
- HTML, CSS, Vanilla JavaScript
- Google Fonts (`Press Start 2P`, `Lato`)
- `localStorage`
- optional GitHub Gist API
- keine Frameworks, kein Build-Step, kein Backend im aktuellen Stand. fileciteturn11file0

---

## ⚙️ Nutzung

1. **Wochenplan importieren** oder Unterrichtstage über die Weltenkarte anlegen  
2. **Tagesprompt kopieren**  
3. **Mitschriebe / KI-Ergebnisse verarbeiten**  
4. **Skills speichern**  
5. **Bearbeitungsstand im Mitschrieb-Tracker prüfen**  
6. **Skills in Trainingsmodi wiederholen**  
7. Optional: **Sync / Backup** ausführen. fileciteturn11file0

---

## 🔐 Gist-Sync einrichten

1. GitHub Token mit Scope `gist` erstellen  
2. Privates Gist anlegen  
3. Token und Gist-ID in der App eintragen  
4. Optional Auto-Sync aktivieren  
5. Push / Pull / Merge über den Datenbereich ausführen. fileciteturn11file0

---

## 📁 Vereinfachte Datenstruktur

```json
{
  "skills": [],
  "modes": [],
  "prefs": {
    "beruf": "Fachinformatiker – Anwendungsentwicklung",
    "kurs": ""
  },
  "dungeons": [],
  "dayTracker": {
    "14.04.2026": {
      "date": "14.04.2026",
      "dungeonIds": [],
      "promptCopied": true,
      "notesDone": true,
      "skillsExtracted": true,
      "skillsImported": false,
      "diary": "",
      "log": []
    }
  },
  "_lastExported": "2026-04-14T00:00:00.000Z"
}
```

Die tatsächliche Struktur kann je nach Fortschritt und importierten Daten größer sein. fileciteturn11file0

---

## ⚠️ Bekannte Grenzen / offene Punkte

Der aktuelle Sync-Stand ist **deutlich gehärtet**, aber noch nicht in jedem Punkt auf dem Niveau der umfassenderen Master-Referenz:
- kein Tombstone-/`deletedIds`-System, da aktuell keine dominanten granularen Einzel-Löschpfade im Fokus stehen
- Startup-Sync ist konservativ eingebaut, aber nicht maximal streng vor jedem ersten Render abgeschottet
- PWA-Dateien (`manifest.json`, `sw.js`) wurden in diesem Stand nicht mitgeliefert / hier nicht dokumentiert. fileciteturn11file0

Das heißt: Für den Alltag ist der Stand brauchbar, aber bei neuen granularen Löschfeatures oder stärkerer Mehrgeräte-Nutzung sollte der Sync erneut überprüft und ggf. weiter gehärtet werden.

---

## 📌 Nächste sinnvolle Arbeitsblöcke

1. **Sync-Testmatrix sauber durchspielen**
   - lokal neuer als remote
   - remote neuer als lokal
   - echter Konflikt gleicher ID
   - echter No-Op
   - PATCH-Fehler / falsches Token

2. **Startup-Sync-Reihenfolge weiter schärfen**
   - wenn nötig noch sauberer vor relevantem Render pflegen

3. **Tombstones prüfen, sobald Einzel-Löschungen relevant werden**
   - besonders wenn Skills, Tracker-Tage oder Dungeon-Einträge granular löschbar werden

4. **README / Projektübergabe aktuell halten**
   - damit neue Chats direkt auf dem richtigen Stand weiterarbeiten. fileciteturn11file0

---

## 🧑‍💻 Autor

Kerim Mallée
