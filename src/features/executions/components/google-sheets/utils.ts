export const generateGoogleSheetsScript = (secretToken?: string) => {
  const token = secretToken && secretToken.trim() !== "" ? secretToken.trim() : "YOUR_SECRET_TOKEN";
  return `function doPost(e) {
  try {
    var SECRET_TOKEN = "${token}";

    // Application-level authentication: validate secret token server-side before accepting payload or modifying sheet
    var requestSecret = "";
    if (e && e.parameter && e.parameter.secret) {
      requestSecret = e.parameter.secret;
    } else if (e && e.postData && e.postData.contents) {
      try {
        var tempParsed = JSON.parse(e.postData.contents);
        requestSecret = tempParsed.secret || "";
      } catch (err) {}
    }

    if (!requestSecret || requestSecret !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", error: "Unauthorized: Invalid or missing secret token" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var sheetName = data.sheetName || "Sheet1";
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
    }
    
    var values = Array.isArray(data.values) ? data.values : [data.values];
    sheet.appendRow(values);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", appended: values }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
};

