import { createRecord, deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { LightningElement, wire } from 'lwc';
import TASK_MANAGER_OBJECT from '@salesforce/schema/Task_Manager__c';
import TASK_NAME_FIELD from '@salesforce/schema/Task_Manager__c.Name';
import TASK_DATE_FIELD from '@salesforce/schema/Task_Manager__c.Task_Date__c';
import COMPLETED_DATE_FIELD from '@salesforce/schema/Task_Manager__c.Completed_date__c';
import IS_COMPLETED_FIELD from '@salesforce/schema/Task_Manager__c.Is_Completed__c';
import ID_FIELD from '@salesforce/schema/Task_Manager__c.Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import loadAllInCompleteRecords from '@salesforce/apex/toDoAppController.loadAllInCompleteRecords';
import loadAllCompleteRecords  from '@salesforce/apex/toDoAppController.loadAllCompleteRecords';
import {refreshApex} from '@salesforce/apex';

export default class ToDoApplication extends LightningElement {

    taskname = "";
    taskdate = null;
    incompletetask = [];
    completetask = [];
    incompleteTaskResult;
    completeTaskResult;

    @wire(loadAllInCompleteRecords) wire_incompleteRecords(result){
        this.incompleteTaskResult = result;
        let { data, error } = result;

        if(data){
            console.log('Incomplete Task Records', data);
        this.incompletetask = data.map((currItem) => ({
            taskId: currItem.Id,
            taskname: currItem.Name,
            taskdate: currItem.Task_Date__c
        }));
        console.log('Incomplete Task Array', this.incompletetask);

        }else if(error){
            console.log('Complete Task Records', error);
        }
    }

    @wire(loadAllCompleteRecords) wire_completeRecords(result){
        this.completeTaskResult = result;
        let { data, error } = result;

        if(data){
            console.log('complete Task Records', data);
        this.completetask = data.map((currItem) => ({
            taskId: currItem.Id,
            taskname: currItem.Name,
            taskdate: currItem.Task_Date__c
        }));
        console.log('Complete Task Array', this.completetask);

        }else if(error){
            console.log('Complete Task Records', error);
        }
    }

    changeHandler(event){
        let { name, value } = event.target;
        if(name === 'taskname'){
            this.taskname = value;
        }else if(name === 'taskdate'){
            this.taskdate = value;
        }
    }

    resetHandler(){
        this.taskname = "";
        this.taskdate = null;
    }

    addTaskHandler(){
        //if task end date is missing, then populate todays date as end date
        if(!this.taskdate){
            this.taskdate = new Date().toISOString().slice(0,10);
        }
        if(this.validateTask()){
            /*this.incompletetask = [
                ...this.incompletetask,
                {
                taskname:this.taskname,
                taskdate:this.taskdate
               }
        ];
        this.resetHandler();
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask = [...sortedArray];
        console.log("this.incompletetask",this.incompletetask);*/
        let inputFields = {};
        inputFields[TASK_NAME_FIELD.fieldApiName] = this.taskname;
        inputFields[TASK_DATE_FIELD.fieldApiName] = this.taskdate;
        inputFields[IS_COMPLETED_FIELD.fieldApiName] = false;
        let recordInput = {
            apiName : TASK_MANAGER_OBJECT.objectApiName,
            fields : inputFields
        }

        createRecord(recordInput).then((result) => {
            console.log('Record Created Successfully', result);
            this.showToast('Success', 'Task Created Successfully', 'success');
            this.resetHandler();
            refreshApex(this.incompleteTaskResult);
        });
        }

    }

    validateTask(){
        let isValid = true;
        //Condition 1 --> Check if task is Empty
        //Condition 2 --> If task name is not empty then check for duplicate
        let element = this.template.querySelector(".taskname");
        if(!this.taskname){
            isValid = false;
        }else{
            let taskItem = this.incompletetask.find(
                (currItem) => 
                    currItem.taskname === this.taskname && 
                    currItem.taskdate === this.taskdate
                );
                if(taskItem){
                    isValid = false;
                    element.setCustomValidity("Task is already available");
                }
        }

        if(isValid){
            element.setCustomValidity("");
        }
        element.reportValidity();
        return isValid;
    }

    sortTask(inputArr){
        let sortedArray = inputArr.sort((a,b) => {
            const dateA = new Date(a.taskdate);
            const dateB = new Date(b.taskdate);
            return dateA - dateB;
        });

        return sortedArray;
    }

    removalHandler(event){
        let recordId = event.target.name;
        console.log('Deleted recordId', recordId);
        deleteRecord(recordId).then(() => {
            this.showToast('Deleted', 'Record Deleted Successfully', 'success');
            refreshApex(this.incompleteTaskResult);
        })
        .catch((error) => {
            this.showToast('Deleted', 'Record Deletion Failed', 'error');
        });
        /*this.incompletetask.splice(index,1);
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask = [...sortedArray];
        console.log("this.incompletetask",this.incompletetask);*/


    }

    completetaskHandler(event){
        let recordId = event.target.name;
        this.refreshData(recordId);
    }

    dragStartHandler(event){
        event.dataTransfer.setData("index", event.target.dataset.item);
    }

    allowDrop(event){
        event.preventDefault();
    }

    dropElementHandler(event){
        let recordId = event.dataTransfer.getData("index");
        this.refreshData(recordId);
    }

    async refreshData(recordId){
        let inputFields = {};
        inputFields[ID_FIELD.fieldApiName] = recordId;
        inputFields[IS_COMPLETED_FIELD.fieldApiName] = true;
        inputFields[COMPLETED_DATE_FIELD.fieldApiName] = new Date().toISOString().slice(0,10);
        let recordInput = {
            fields: inputFields 
        };
        try{
        await updateRecord(recordInput);
        await refreshApex(this.incompleteTaskResult);
        await refreshApex(this.completeTaskResult);
        this.showToast('Updated', 'Record Updated Successfully', 'success');
        }catch(error){
            console.log('Update Operation Failed', error);
            this.showToast('Error', 'Record Updation Failed', 'error');
        }
        

        /*let removeItem = this.incompletetask.splice(index,1);
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask = [...sortedArray];
        console.log("this.incompletetask",this.incompletetask);

        this.completetask = [...this.completetask,removeItem[0]];*/
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
                
        });
        this.dispatchEvent(event);
    }
}