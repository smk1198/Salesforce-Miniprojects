import { LightningElement,track } from 'lwc';
import getFilteredAccountIds from '@salesforce/apex/ContactCreationController.getFilteredAccountIds';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class CreateContactForm extends LightningElement {

    leadSourceValue;
    @track accountIdList = [];
    selectedAccountId;


    handleLeadSourceChange(event){
        //console.log('Selected Lead Source --> ' +event.detail.value);
        this.leadSourceValue = event.detail.value;
        this.fetchFilteredAccounts();
    }

    fetchFilteredAccounts()
    {
        getFilteredAccountIds({leadSource : this.leadSourceValue})
        .then(result => {
            this.accountIdList = result;
        })
        .catch(error => {
            console.error('Error fetching account ids : ' + error);
        })
    }

    get accountFilter()
    {
        return this.accountIdList.length > 0 ? {
            criteria : [
                {
                    fieldPath : 'Id',
                    operator : 'in',
                    value : this.accountIdList
                }


            ]
        } : null;
    }

    handleAccountChange(event)
    {
        this.selectedAccountId = event.detail.recordId;
    }

    handleError(event)
    {
        console.log('Error while creating contact : ' +JSON.stringify(error));
    }

    handleSuccess(event)
    {
        //console.log('Contact created successfully');
        this.dispatchEvent(new showToastEvent({
            title : 'Success',
            message : 'Contact created successfully',
            variant : 'success'
        }));
    }

    handleSubmit(event)
    {
        event.preventDefault();

        const recordForm = this.template.querySelector('lightning-record-edit-form');

        const fields = {};

        const inputFields = recordForm.querySelectorAll('lightning-input-field');

        inputFields.forEach(field => {
            fields[field.fieldName] = field.value;
        });

        fields['AccountId'] = this.selectedAccountId;

        this.template.querySelector('lightning-record-edit-form').submit(fields);

    }
}