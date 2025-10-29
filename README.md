# AF Queue Monitor - Exakta kötider för Arbetsförmedlingen

> 🎯 **Se exakt väntetid i minuter istället för bara "lång kötid"**

Chrome-tillägg som visar exakta kötider på Arbetsförmedlingens kontaktsida. Ingen mer gissning - se precis hur länge du behöver vänta!

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/Version-1.2.0-green?style=for-the-badge)](https://github.com/SleepyBearIV/AFCromeE)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## ✨ Funktioner

### 🎯 **Exakta kötider**
- Visar precis hur många minuter du behöver vänta
- Ingen mer "lång kötid" - se 154.2 minuter istället

### 🔴🟡🟢 **Färgkodad status**
- **Grön**: Mycket kort kö (≤5 min)
- **Gul**: Kort kö (≤15 min)  
- **Orange**: Medellång kö (≤30 min)
- **Röd**: Lång kö (>30 min)

### 📱 **Flytande indikator**
- Diskret indikator i hörnet av sidan
- Klicka för detaljerad information
- Uppdateras automatiskt i realtid

### ⚡ **Realtidsuppdatering**
- Data hämtas direkt från Arbetsförmedlingens system
- Automatiska uppdateringar när kötider ändras
- Ingen fördröjning eller cachning

## 🚀 Installation

### Från Chrome Web Store (Rekommenderat)
*Coming soon - under review*

### Manuell installation (För utvecklare)
1. Ladda ner eller klona detta repository
2. Öppna Chrome och gå till `chrome://extensions/`
3. Aktivera "Utvecklarläge" (toggle i övre högra hörnet)
4. Klicka "Läs in uppackad"
5. Välj mappen med tillägget
6. Besök [Arbetsförmedlingens kontaktsida](https://arbetsformedlingen.se/kontakt/for-arbetssokande)

## 🎬 Hur det fungerar

### 1. **Besök kontaktsidan**
Gå till Arbetsförmedlingens kontaktsida som vanligt

### 2. **Se exakta tider**
Istället för "lång kötid" ser du: **"Just nu kan det vara lång kötid (154.2 min)"**

### 3. **Flytande indikator**
En diskret indikator visas med:
- 🎯 Aktuell kötid
- 🔴 Färgkodad status  
- ⏰ Senast uppdaterad

### 4. **Klicka för detaljer**
Klicka på indikatorn för mer information om kötiden

## � Teknisk information

### Arkitektur
- **Manifest V3** - Senaste Chrome extension standarden
- **Dual script approach** - Content script + Page hook för robust funktion
- **Message passing** - Säker kommunikation mellan skript-kontexter

### Datakälla
```javascript
// Arbetsförmedlingen kör redan denna kod:
const minutes = num / 60;
console.log("#phoneQueueAS", "-", minutes, "min");

// Vi interceptar och visar exakt värde
```

### Säkerhet
- ✅ Inga externa API-anrop
- ✅ Ingen datainsamling
- ✅ Läser endast offentlig data
- ✅ Minimala behörigheter

## �️ Integritet

Detta tillägg:
- ✅ **Samlar INGEN data** om dig eller din användning
- ✅ **Skickar INGET** till externa servrar  
- ✅ **Fungerar offline** när sidan är laddad
- ✅ **Läser endast** offentligt tillgänglig kötid-data
- ✅ **Ändrar INTE** någon annan funktionalitet på sidan

## 🤝 Bidra

### Rapportera buggar
- Öppna en [issue](https://github.com/SleepyBearIV/AFCromeE/issues)
- Inkludera Chrome-version och beskrivning av problemet
- Bifoga skärmdumpar om möjligt

### Föreslå funktioner
- Öppna en [feature request](https://github.com/SleepyBearIV/AFCromeE/issues/new)
- Beskriv hur funktionen skulle hjälpa användare

### Utveckling
```bash
git clone https://github.com/SleepyBearIV/AFCromeE.git
cd AFCromeE
# Ladda tillägget i Chrome för testning
```

## 📋 Kända begränsningar

- Fungerar endast på `arbetsformedlingen.se`
- Kräver att JavaScript är aktiverat
- Vissa företagsnätverk kan blockera tillägg

## 🆘 Felsökning

### Tillägget fungerar inte?
1. **Kontrollera att du är på rätt sida**: `arbetsformedlingen.se/kontakt/for-arbetssokande`
2. **Öppna Developer Tools** (F12) och kolla Console för fel
3. **Ladda om sidan** - ibland behövs en refresh
4. **Starta om Chrome** om problem kvarstår

### Ser du fortfarande "lång kötid"?
- Öppna Console (F12) och leta efter meddelanden som börjar med "📞 AF Queue Monitor"
- Om du ser "Function intercepted" eller "Console intercepted" så fungerar tillägget

## 📞 Support

- 🐛 **Buggar**: [GitHub Issues](https://github.com/SleepyBearIV/AFCromeE/issues)
- 💡 **Funktionsförslag**: [GitHub Discussions](https://github.com/SleepyBearIV/AFCromeE/discussions)
- 📧 **Övrigt**: Öppna en issue på GitHub

## � Licens

MIT License - Se [LICENSE](LICENSE) för detaljer

## ⚠️ Disclaimer

Detta tillägg är **inte officiellt** från Arbetsförmedlingen. Det visar endast offentligt tillgänglig data på ett mer användarvänligt sätt.

---

<div align="center">

**Gjort med ❤️ för alla som är trötta på att bara se "lång kötid"**

[⭐ Stjärnmärk på GitHub](https://github.com/SleepyBearIV/AFCromeE) • [🚀 Lägg till i Chrome](https://chrome.google.com/webstore) • [🐛 Rapportera bugg](https://github.com/SleepyBearIV/AFCromeE/issues)

</div>