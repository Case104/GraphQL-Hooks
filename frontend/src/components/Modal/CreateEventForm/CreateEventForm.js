import React from 'react';

const CreateEventForm = (props) => (
    <form onSubmit={props.onConfirm}>
        <div className='form-control'>
            <label htmlFor='title'>Title: </label>
            <input type='text' id='title' ref={props.titleRef}/>
        </div>
        <div className='form-control'>
            <label htmlFor='price'>Price:</label>
            <input type='number' id='price'ref={props.priceRef}/>
        </div> 
        <div className='form-control'>
            <label htmlFor='date'>Date:</label>
            <input type='datetime-local' id='date' ref={props.dateRef}/>
        </div>                                                            
        <div className='form-control'>
            <label htmlFor='description'>Description:</label>
            <textarea id='description' rows='4' ref={props.descriptionRef}/>
        </div>                       
    </form>
)

export default CreateEventForm;