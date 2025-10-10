public with sharing class TopAccountsController {
   
    @AuraEnabled(cacheable=true)
    public static List<Account> getTopAccountWithOpp(){

        List<Account> accList = [Select Id,Name,Industry,Phone,AnnualRevenue,
        (Select Id,Name,StageName,LeadSource,Amount From Opportunities Where isClosed = false order by Amount desc Limit 5) 
        From Account Where AnnualRevenue != null order by AnnualRevenue desc Limit 10];

        return accList;
    }
}