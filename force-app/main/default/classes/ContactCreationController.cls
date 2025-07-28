public with sharing class ContactCreationController {
    
    @AuraEnabled(cacheable=true)
    public static List<Id> getFilteredAccountIds(String leadSource){

        List<AggregateResult> accountAgg = [
            Select AccountId From Opportunity 
            Where 
            Account.AccountSource =: leadSource 
            and 
            Account.IsActive__c = true 
            GROUP BY AccountId 
            HAVING Count(Id) > 2];

            List<Id> filteredIds = new List<Id>();

            for(AggregateResult ar : accountAgg)
            {
                filteredIds.add((Id) ar.get('AccountId'));
            }

            return filteredIds;
    }
}