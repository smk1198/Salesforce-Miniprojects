import { LightningElement, wire } from 'lwc';
import getTopAccountWithOpp from '@salesforce/apex/TopAccountsController.getTopAccountWithOpp';
import StageName from '@salesforce/schema/Opportunity.StageName';

export default class TopAccountsComponent extends LightningElement {
    accountsData=[];
    errors;
    selectedAccount = {};
    selectedAccountName = '';
    oppData = [];
    

    accColumns = [
        {label:'Account Name',fieldName:'name',type:'text'},
        {label:'Industry',fieldName:'industry',type:'text'},
        {label:'Phone',fieldName:'phone',type:'phone'},
        {label:'Annual Revenue',fieldName:'annualRevenue',type:'currency'}
    ]

    oppColumns = [
        {label:'Opportunity Name',fieldName:'name',type:'text'},
        {label:'Amount',fieldName:'amount',type:'currency'},
        {label:'Stage Name',fieldName:'stageName',type:'text'}
        
    ]

    @wire(getTopAccountWithOpp)
    wiredAccounts({data,error}){
        if(data){
            console.log('data is' ,data);
           this.accountsData =  data.map(currItem => {
                return{
                    id : currItem.Id,
                    name : currItem.Name,
                    industry : currItem.Industry || '',
                    phone : currItem.Phone || '',
                    annualRevenue : currItem.AnnualRevenue || '',
                    opportunities: currItem.Opportunities || []
                }
                

            })
            this.errors = null;
        }
        if(error){
            console.log('error is' ,error);
            this.accountsData = null;
            this.errors = error.body.message;
        }
    }

    handleRowSelection(event){
        const selectedRows = event.detail.selectedRows;
        const row = selectedRows[0];
        console.log('row is', row);
        this.selectedAccount = row;
        this.selectedAccountName = row.name;
        const opportunities = row.opportunities || [];
        console.log('opportunities are ' ,opportunities);
       this.oppData = opportunities.map(currItem => {
            return{
                id:currItem.Id,
                name:currItem.Name,
                amount:currItem.Amount,
                StageName:currItem.StageName,
            }
        })
    }

    get hasOpportunities(){
        return this.oppData.length > 0;
    }

}