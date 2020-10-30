import React, { Fragment, useState } from 'react';
import AuthApi from "./authapi";

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    
    const Auth = React.useContext(AuthApi);

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = e => {
       e.preventDefault();
       const formData = new FormData();
       formData.append('thefile', file);
       const options = {
           method: 'POST',
           body: formData
       };
       fetch(`http://localhost:5000/upload/?username=${Auth.username}`, options)
       .then(response => console.log(response.status))
       .catch(err => console.log(err))

    }

    return(
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className='custom-file mb-4'>
                    <input type='file'
                            className='custom-file-input' 
                            id='customFile'
                            onChange={onChange} 
                    />
                    <label 
                        className='custom-file-label' 
                        htmlFor='customFile'>
                            {filename}
                    </label>
                </div>
                <input type="submit" 
                       value="Upload" 
                       className="btn btn-primary btn-block mt-4" />
            </form>
        </Fragment>
    )
}


export default FileUpload;