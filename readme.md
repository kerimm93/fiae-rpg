# ⚔️ FI Skill Tracker

Ein gamifizierter Skill-Tracker für die Umschulung zum **Fachinformatiker – Anwendungsentwicklung**.
Verwandelt deinen Lernfortschritt in ein RPG-System mit XP, Levels, Kampagnen und Dungeons.

---

## 🚀 Features

### 📜 Tagesabschluss-System

* Geführter 5-Schritte-Prozess:

  1. Prompt generieren
  2. GPT-Ergebnis einfügen
  3. Abgleich (Duplikate entfernen)
  4. Neue Skills speichern
  5. Abschluss

* Automatische Skill-Erkennung aus deinem Lernalltag

---

### ⚔️ Skill-Tracking

* Skills mit:

  * Fach
  * Level (0–4)
  * XP
  * Datum
* Fortschrittsanzeige mit:

  * Gesamt-XP
  * Durchschnittslevel
  * Meister-Skills

---

### 🧙 Training-System (RPG-Modi)

Trainiere deine Skills mit KI-gestützten Lernmodi:

* ⚡ Prüfungsarena (Quiz)
* 🧙 Weiser Mentor (Erklärungen)
* 🌀 Socratisches Verhör
* 🗡️ Dungeon-Szenario

Eigene Modi können erstellt werden.

---

### 🌾 Skill Farmer

* Extrahiert Skills aus:

  * Skripten
  * Folien
  * Notizen
* Automatischer Abgleich mit bestehender Datenbank

---

### 🗺️ Wochenkampagne

* Importiere deinen Stundenplan
* Generiere tägliche Lern-Prompts
* Strukturiere deinen Unterricht als Kampagne

---

### 🌍 Weltenkarte (Progress-Visualisierung)

* Dungeons pro Fach
* Fortschritt als Karte visualisiert:

  * Nebel (unbekannt)
  * Erkundet
  * Cleared
  * Gemeistert

---

### ☁️ GitHub Gist Sync

* Cloud-Speicherung deiner Daten
* Auto-Sync möglich
* Merge-Funktion für Konflikte

---

### 💾 Datenmanagement

* CSV Export / Import
* JSON Komplett-Backup
* Lokale Speicherung via `localStorage`

---

## 🧠 Konzept

Der FI Skill Tracker basiert auf drei Prinzipien:

1. **Alles erfassen** → Jeder gelernte Skill wird dokumentiert
2. **Gamification** → Fortschritt wird sichtbar und motivierend
3. **KI-Integration** → GPT hilft bei Struktur, Analyse und Training

---

## 🛠️ Tech Stack

* **Single-File Web App**
* HTML, CSS, Vanilla JavaScript
* Keine externen Dependencies (außer Fonts)
* Speicherung:

  * `localStorage`
  * optional: GitHub Gist API

---

## 📦 Installation

Keine Installation nötig.

```bash
git clone https://github.com/your-username/fi-skill-tracker.git
cd fi-skill-tracker
```

Dann einfach die `index.html` öffnen.

---

## ⚙️ Nutzung

1. Öffne die App im Browser
2. Starte mit **Tagesabschluss**
3. Füge deine Lerninhalte ein
4. Speichere neue Skills
5. Trainiere sie im RPG-System

---

## 🔐 Gist Sync einrichten

1. GitHub Token erstellen:
   https://github.com/settings/tokens
   → Scope: `gist`

2. Neues **privates Gist** erstellen

3. Token + Gist-ID in der App eintragen

---

## 📁 Datenstruktur (vereinfacht)

```json
{
  "skills": [
    {
      "name": "Subnetting",
      "fach": "Netzwerktechnik",
      "level": 2,
      "xp": 3,
      "datum": "01.04.2026"
    }
  ]
}
```

---

## 🎯 Ziel

Diese App ist darauf ausgelegt:

* Lernstoff systematisch zu erfassen
* Wissen aktiv zu trainieren
* Fortschritt sichtbar zu machen
* Motivation durch Struktur + Spielmechanik zu erhöhen

---

## ⚠️ Hinweis

* Daten werden lokal gespeichert
* Gist Sync ist optional, aber empfohlen
* Kein Server → volle Kontrolle über deine Daten

---

## 📌 Roadmap (Ideen)

* Kalender-Ansicht für Lernfortschritt
* Skill-Abhängigkeiten (Skill Trees)
* Automatische Weekly Review Integration
* Mobile UX Optimierung

---

## 🧑‍💻 Autor

Kerim Mallée
