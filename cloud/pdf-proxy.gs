/* TrainTanmay PDF proxy on Google Apps Script.
   The backup for the Cloudflare Worker, for school and office WiFi that blocks workers.dev
   (script.google.com is almost never blocked). Madas Maths and UAT-UK don't let other sites load
   their PDFs, so this fetches the paper live from the source and passes it straight on to the
   browser. Nothing is stored. Only those two sources, and only PDFs, are allowed through.

   Set up (once, about 5 minutes):
     1. Go to script.google.com > New project. Delete what's there and paste in this whole file.
     2. Deploy > New deployment > the gear next to "Select type" > Web app.
          Execute as:      Me
          Who has access:  Anyone
        Deploy, allow access when Google asks, and copy the Web app URL (ends in /exec).
     3. Put that URL into GAS near the top of crop.js (var GAS = 'https://script.google.com/macros/s/.../exec').
   After editing this script later: Deploy > Manage deployments > edit > Version: New version,
   so the same URL keeps working. */

var ALLOW = /^https:\/\/((www\.)?madasmaths\.com|uat-wp\.s3\.eu-west-2\.amazonaws\.com)\/[^?#]*\.pdf$/i;

function doGet(e) {
  var url = (e && e.parameter && e.parameter.url) || '';
  if (!ALLOW.test(url)) return out({ error: 'not allowed' });
  try {
    var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (r.getResponseCode() !== 200) return out({ error: 'source said ' + r.getResponseCode() });
    // Apps Script can't send raw bytes, so the PDF travels as base64 text; crop.js turns it back into the file
    return out({ pdf: Utilities.base64Encode(r.getBlob().getBytes()) });
  } catch (err) {
    return out({ error: 'fetch failed' });
  }
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
