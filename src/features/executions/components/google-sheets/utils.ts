export const generateGoogleSheetsScript = () => `function doPost(e) {
  try {
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
