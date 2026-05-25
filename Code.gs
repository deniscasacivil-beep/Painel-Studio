function doGet(e) {
  // 1. Se a URL receber um parâmetro "id" (?id=xyz), renderiza o HTML do Drive
  if (e && e.parameter && e.parameter.id) {
    var fileId = e.parameter.id;
    try {
      var file = DriveApp.getFileById(fileId);
      var htmlContent = file.getBlob().getDataAsString();
      
      return HtmlService.createHtmlOutput(htmlContent)
                        .setTitle(file.getName())
                        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } catch(err) {
      return HtmlService.createHtmlOutput("<h3>Erro ao carregar o arquivo: " + err.toString() + "</h3>");
    }
  }

  // 2. Caso contrário, retorna os dados da planilha em formato JSON para o nosso painel
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var richTexts = dataRange.getRichTextValues();
    
    // Tentar recuperar as URLs caso estejam ocultas no texto
    for (var i = 0; i < values.length; i++) {
       for (var j = 0; j < values[i].length; j++) {
           if (values[i][j]) {
              var url = richTexts[i][j].getLinkUrl();
              if (url && String(values[i][j]).indexOf(url) === -1) {
                  // Concatena a URL ao final do texto para que o painel consiga ler
                  values[i][j] = values[i][j] + " " + url;
              }
           }
       }
    }
    
    var response = {
      status: "success",
      data: values
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString(),
        data: []
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

