export const generateGoogleSheetsTriggerScript = (webhookUrl: string) => `function onEditOrChange(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = e ? e.range : sheet.getActiveRange();
  
  if (!range) return;
  
  var row = range.getRow();
  var sheetName = sheet.getName();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var rowValues = {};
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i] || ("col_" + (i + 1));
    rowValues[key] = rowData[i];
  }
  
  var payload = {
    sheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
    sheetName: sheetName,
    rowNumber: row,
    timestamp: new Date().toISOString(),
    rowValues: rowValues
  };
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  
  var WEBHOOK_URL = '${webhookUrl}';
  
  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
  } catch (error) {
    console.error('Google Sheets trigger failed:', error);
  }
}`;
