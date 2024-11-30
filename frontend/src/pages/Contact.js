import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.name) {
            errors.name = "Name is required.";
            isValid = false;
        }

        if (!formData.email) {
            errors.email = "Email is required.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid.";
            isValid = false;
        }

        if (!formData.message) {
            errors.message = "Message is required.";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmitted(true);
            console.log("Form submitted:", formData);
        }
    };

    return (
        <div className="contact-wrapper">
            <div className="contact-container">
                <h1 className="text-center mb-4">Contact Us</h1>
                {submitted ? (
                    <div className="alert alert-success text-center">
                        Thank you! Your message has been sent.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
    <div className="mb-3">
        <input
            type="text"
            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
        />
        {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
    </div>
    <div className="mb-3">
        <input
            type="email"
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
        />
        {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
    </div>
    <div className="mb-3">
        <textarea
            className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
        />
        {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
    </div>
    <button type="submit" className="cssbuttons-io-button">
        Send Message
        <div className="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
        </div>
    </button>
</form>

                )}
            </div>
        </div>
    );
};

export default Contact;
