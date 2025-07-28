import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AdminAnnouncement extends NavigationMixin(LightningElement) {

    @api title;
    @api message;
    @api severity;
    @api ctaLabel;
    @api ctaDestination;

    get computedHeaderClass(){
        switch (this.severity) 
        {
            case 'info':
                return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_info'

            case 'warning':
                return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_warning'
            default:
                return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error';
        }
    }

    get showButton(){
        return this.ctaLabel && this.ctaLabel.trim().length > 0;
    }

    handleClick(){
        if(this.ctaDestination){
            let pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: this.ctaDestination
                }
            };
            this[NavigationMixin.Navigate](pageReference);
        }
    }
}