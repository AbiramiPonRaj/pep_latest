import React, { useState, ChangeEvent, FormEvent } from 'react';
import { BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton } from '../../styles';

interface SignupProps {
    switchToSignin: () => void;
}

interface FormData {
    firstName: string;
    lastName: string;
    login: string;
    password: string;
}

function Signup({ switchToSignin }: SignupProps) {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        login: '',
        password: '',
    });

    const { firstName, lastName, login, password } = formData;

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // const onSubmitRegister = async (e: FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         // Assuming you have a function to handle registration, replace this with your actual API call
    //         await registerUser(formData);
    //         console.log('Registration Successful');
    //     } catch (error) {
    //         console.error('Registration Error:', error);
    //     }
    // };

    return (
        <BoxContainer>
            <FormContainer 
            // onSubmit={onSubmitRegister}
            >
                <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={onChangeHandler}
                />
                <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={onChangeHandler}
                />
                <Input
                    type="text"
                    name="login"
                    placeholder="Username"
                    value={login}
                    onChange={onChangeHandler}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChangeHandler}
                />
                <SubmitButton type="submit">Signup</SubmitButton>
            </FormContainer>
            <MutedLink href="#">
                Already have an account?{' '}
                <BoldLink href="#" onClick={switchToSignin}>
                    Signin
                </BoldLink>
            </MutedLink>
        </BoxContainer>
    );
}

export default Signup;
