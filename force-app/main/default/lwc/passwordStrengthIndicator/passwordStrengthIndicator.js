import { LightningElement,track } from 'lwc';

export default class PasswordStrengthIndicator extends LightningElement {
     
    inputType = 'password';
    password = '';
   @track rules = [
    {
        label : 'Minimum 8 characters',
        test : (pwd) => pwd.length >= 8
    },
    {
        label : 'At least 1 uppercase letter',
        test : (pwd) => /[A-Z]/.test(pwd)
    },
    {
        label : 'At least 1 lowercase letter',
        test : (pwd) => /[a-z]/.test(pwd)
    },
    {
        label : 'At least 1 number',
        test : (pwd) => /[0-9]/.test(pwd)
    },
    {
        label : 'At least 1 special character',
        test : (pwd) => /[^A-Za-z0-9]/.test(pwd)
    }
   ];

    get toggleLabel(){
        return this.inputType === 'password' ? 'Show' : 'Hide';
    }

    togglePassword()
    {
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
    }

    handleInput(event)
    {
        this.password = event.target.value;
        console.log('Password Typed --> ' + this.password);
    }

    get checkListRules()
    {
        return this.rules.map(rule => {
            return {
                label : rule.label,
                class : rule.test(this.password) ? 'valid' : 'invalid'
            }
        });
    }

    get strengthScore()
    {
        let score = 0;
        for(let rule of this.rules)
        {
            if(rule.test(this.password)) score++;
        }
        return score;
    }

    get strengthStyle()
    {
        const score = this.strengthScore;
        let width = `${(score / this.rules.length) * 100}%`;

        let color = 'red';

        if(score >=3 && score < 5) color='orange';
        if(score === 5) color='green';
        return `width : ${width}; background-color : ${color};`;

    }

    get strengthText()
    {
        const score = this.strengthScore;

        if(score === 0) return '';
        if(score <= 2) return 'Weak';
        if(score === 3 || score === 4) return 'Medium';
        return 'Strong';
    }
}