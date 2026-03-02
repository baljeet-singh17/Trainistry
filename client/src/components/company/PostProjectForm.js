import React, { useState } from 'react';
import companyService from '../../services/companyService';
import '../../styles/companyDashboard.css';

const PostProjectForm = () => {
    const [formData, setFormData] = useState({
        technology: '',
        location: '',
        startDate: '',
        durationDays: '',
        perDayPayment: '',
        paymentTerms: '',
        tfaProvided: false,
        tocProvided: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Placeholder ID for now
            const companyId = "65df1234abcd5678"; 
            await companyService.postProject(companyId, formData);
            alert("Success: Training Requirement Posted!");
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="form-wrapper">
            <h2 className="form-title">Post Training Requirement</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Technology Stack</label>
                    <input type="text" name="technology" className="form-input" placeholder="e.g. MERN, Java Full Stack" onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group" style={{flex: 1}}>
                        <label>Start Date</label>
                        <input type="date" name="startDate" className="form-input" onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{flex: 1}}>
                        <label>Duration (Days)</label>
                        <input type="number" name="durationDays" className="form-input" placeholder="e.g. 10" onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Budget (Per Day Payment)</label>
                    <input type="number" name="perDayPayment" className="form-input" placeholder="INR" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Inclusions</label>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <label><input type="checkbox" name="tfaProvided" onChange={handleChange} /> TFA</label>
                        <label><input type="checkbox" name="tocProvided" onChange={handleChange} /> TOC/Curriculum</label>
                    </div>
                </div>

                <button type="submit" className="btn-primary">Submit Requirement</button>
            </form>
        </div>
    );
};

export default PostProjectForm;