import { FormGroup } from "@angular/forms";

export interface Name {
    firstname: string,
    lastname: string,
}

export interface UserForm {
    email: string,
    username: string,
    password: string,
    rePassword: string,
    name: FormGroup<any>
}