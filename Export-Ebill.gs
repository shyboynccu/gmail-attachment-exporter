var EBILL_LABEL_NAME = 'E-bill';
var CREATE_FOLDER_IF_NOT_EXIST = true;
var ATTACHMENT_EXTENSIONS = ['.zip', '.pdf'];

function getFolderByName(parentFolder, name, bCreateFolder) {
  var folders = parentFolder.getFoldersByName(name);
  var folder = null;
  if (folders.hasNext()) {
   folder = folders.next();
  } else if (bCreateFolder) {
   folder = parentFolder.createFolder(name)
  }
  
  return folder;
}

function prefixDateString(original_string, dateObj) {
  return "[" + dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "] " + original_string
}

function main() {
  var fromEmail = [];
  var ebillLabel = GmailApp.getUserLabelByName(EBILL_LABEL_NAME);
  var threads = ebillLabel.getThreads();
  
  //Get the top folder according to the specified label name
  ebill_folder = getFolderByName(DriveApp, EBILL_LABEL_NAME, CREATE_FOLDER_IF_NOT_EXIST);
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages(); //Get msgs from each thread
    var from = messages[0].getFrom();
    var email_index = from.indexOf(" <") //Deal with the string like "Sender Name <email address>"
    if ( email_index > 0) {
      from = from.substring(0, email_index);
    }
    
    attachments = messages[0].getAttachments();
    if (attachments.length > 0) {
      bill_folder = getFolderByName(ebill_folder, from, CREATE_FOLDER_IF_NOT_EXIST);
      for (var j = 0; j < attachments.length; j++) {
        attachment = attachments[0];
        for (var k in ATTACHMENT_EXTENSIONS) {
          if (attachments[j].getName().indexOf(ATTACHMENT_EXTENSIONS[k]) > 0) {
            bill_date = messages[0].getDate();
            attachment.setName(prefixDateString(attachment.getName(), bill_date));
            //Logger.log(attachment.getName());
            bill_folder.createFile(attachments[j]);
          }
        }
      }
    }
  }
}
