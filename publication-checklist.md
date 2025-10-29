# Publication Checklist for Chrome Web Store

## ✅ Pre-Publication Checklist

### Files Ready:
- [x] manifest.json (version 1.0.0)
- [x] content-script.js 
- [x] page-hook.js
- [x] popup.html
- [x] popup.css  
- [x] popup.js
- [x] icons/AF_BEAR.png (used for all sizes)
- [x] README.md
- [x] privacy-policy.md
- [x] store-description.md

### Testing:
- [ ] Extension loads without errors
- [ ] Icons display properly in toolbar
- [ ] Queue times show exact minutes  
- [ ] Popup opens and works
- [ ] Floating indicator appears and functions
- [ ] Works on https://arbetsformedlingen.se/kontakt/for-arbetssokande
- [ ] No console errors in browser developer tools

### Chrome Web Store Requirements:
- [x] Version starts with 1.0.0
- [x] Privacy policy created
- [x] Store description ready (Swedish)
- [x] Icons in correct format (.png)
- [x] No prohibited content
- [x] Minimal permissions requested
- [ ] Screenshots prepared (see below)

## 📸 Screenshots Needed (1280x800 or 640x400 pixels):

1. **Before**: Show Arbetsförmedlingen page with "Just nu kan det vara lång kötid"
2. **After**: Show same page with "Just nu kan det vara lång kötid (154.2 min)"  
3. **Floating Indicator**: Show the colored floating indicator in action

## 🚀 Publication Steps:

1. **Zip the extension files**:
   - Include: manifest.json, all .js files, popup files, icons folder
   - Exclude: .git, node_modules, .md files (except if required)

2. **Go to Chrome Developer Dashboard**:
   - https://chrome.google.com/webstore/devconsole/

3. **Upload and fill details**:
   - Upload zip file
   - Add store description (Swedish)
   - Upload screenshots  
   - Set category: Productivity
   - Add privacy policy URL (use GitHub raw link)

4. **Submit for Review**:
   - Review can take 1-3 days
   - Check email for any feedback

## 📝 Notes:
- Extension is ready for publication
- All code is clean and optimized  
- Privacy-compliant (no data collection)
- Follows Chrome Web Store policies

## 🔗 Useful Links:
- Chrome Developer Dashboard: https://chrome.google.com/webstore/devconsole/
- Privacy Policy (GitHub): https://raw.githubusercontent.com/SleepyBearIV/AFCromeE/main/privacy-policy.md
- Extension Repository: https://github.com/SleepyBearIV/AFCromeE