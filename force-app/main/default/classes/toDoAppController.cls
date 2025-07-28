public with sharing class toDoAppController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task_Manager__c> loadAllInCompleteRecords(){
        return [
        Select Id,Name,Task_Date__c 
        From Task_Manager__c 
        WHERE ownerId = :userInfo.getUserId() AND Is_Completed__c = FALSE
        WITH USER_MODE 
        ORDER BY Task_Date__c 
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Task_Manager__c> loadAllCompleteRecords(){
        return [
        Select Id,Name,Task_Date__c 
        From Task_Manager__c 
        WHERE ownerId = :userInfo.getUserId() AND Is_Completed__c = TRUE
        WITH USER_MODE 
        ORDER BY Completed_date__c desc 
        ];
    }
}