import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function InfoModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Asset hosting - click for info</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        How to use Asset hosting script?
                    </Typography>
                    <Typography id="modal-modal-title" sx={{ mt: 2 }}>
                        The script is designed to work with files on local machine and has little to no error handling. Please thread carefully.
                    </Typography>
                    <br />
                    <Divider />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        0. Extract all assets in a joint folder ./YYYYMMDD/ to ensure the correct adTag rendering. Example: /Users/JohnDoe/Documents/20220515
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        1. Select input data. The most important is the folder where assets are stored.
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        2. When parsing data, all the files with Entity Suffix will be crawled for Search Entity and rendered. You can check their HTML or render the ad.
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        3. Input correct Width and Height parameters for each ad.
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        4. Generating previews creates adTags and replaces Search Entities inside crawled documents for preview (files are not changed yet).
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        5. Bulk Change confirmation button is shown. By pressing the button, you actually change contents of the files inside the initial Asset Folder structure.
                    </Typography>
                    <br />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Created with ♥
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}