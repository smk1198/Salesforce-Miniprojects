public  class FileUploaderController 
{
    @AuraEnabled
    public static void uploadFileToAccount(String fileName, String base64Data, 
    String contentType, Id accountId)
    {
        try{

        if(String.isBlank(fileName) || String.isBlank(base64Data) 
        || String.isBlank(accountId))
        {
            throw new AuraHandledException('Missing required file data or account id');

        }

        ContentVersion cv = new ContentVersion();
        cv.Title = fileName.contains('.') ? fileName.substring(0,fileName.lastIndexOf('.')) : fileName;
        cv.pathOnClient = fileName;
        cv.VersionData = EncodingUtil.base64Decode(base64Data);
        cv.Origin = 'H';
        insert cv;

        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [Select ContentDocumentId From ContentVersion Where Id =: cv.Id].ContentDocumentId;
        cdl.LinkedEntityId = accountId;
        cdl.ShareType = 'V';
        cdl.Visibility = 'AllUsers';

        insert cdl;

        }catch(Exception e){
            throw new AuraHandledException('Upload Failed : ' +e.getMessage());
        }
        
        
    }

}
