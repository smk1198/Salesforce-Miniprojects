import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Loan__c.Account_Number__c';
import IFSC_CODE_FIELD from '@salesforce/schema/Loan__c.IFSC_Code__c';
export default class LoanBankDetailsCmp extends LightningElement {
    accountNumber;
    ifscCode;
    @api recordId;
    copyMessage;

    @wire(getRecord, {
        recordId : '$recordId',
        fields : [ACCOUNT_NUMBER_FIELD, IFSC_CODE_FIELD]
    })
    wiredLoan({error,data})
    {
        if(data)
        {
            this.accountNumber = data.fields.Account_Number__c?.value;
            this.ifscCode = data.fields.IFSC_Code__c?.value;
        }
        else if(error)
        {
            console.error('Error fetching Loan Record : ' +error);
        }
    }

    copyAccountNumber()
    {
        this.copyToClipboard(this.accountNumber,'Account Number Copied');
    }

    copyIfscCode()
    {
        this.copyToClipboard(this.ifscCode,'IFSC Code copied');
    }

    copyToClipboard(value,message)
    {
        if(!value) return;

        navigator.clipboard.writeText(value)

        .then(() => {
            this.copyMessage = message;
            setTimeout(() => this.copyMessage = '', 2000);
        })
        .catch(err => {
            console.error('Clipboard copy failed : ',err);
            this.copyMessage = '';
        });
    }
}