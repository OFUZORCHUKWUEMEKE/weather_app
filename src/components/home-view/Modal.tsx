import React from 'react'
import { ICoords } from '../../interfaces/ICoords';
import { localstorageGet, localstorageSet } from '../../utils/local-storage-helpers';
import { localStorageKeys, pageurl } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { getUserLocationCoords } from '../../utils/functions';
import './index.scss'

type Props = {}

const Modal = (props: Props) => {
    const navigate = useNavigate();

    const requestLocationPerms = () => {
        const onSuccess = (coords: ICoords) => {
            const loc = `${coords?.latitude},${coords?.longitude}`;
            localstorageSet(localStorageKeys.userLocation, loc);

            navigate(pageurl.WEATHER_DETAIL.replace(":location", loc));
        };

        const onError = (err: GeolocationPositionError) => {
            if (err.code === err.PERMISSION_DENIED) {
                return;
            }

            const localLocation = localstorageGet<string>(
                localStorageKeys.userLocation
            );
            if (!localLocation) {
                return;
            }
            navigate(pageurl.WEATHER_DETAIL.replace(":location", localLocation));
        };

        getUserLocationCoords(onSuccess, onError);
    };
    return (
        <>
            {/* <button data-modal-target="#modal">Open Modal</button> */}
            <div className="modal active" id="modal">
                <div className="modal-header">
                    <div className="title">
                        <h2>
                            Enable Location Services
                        </h2>
                        </div>
                    <button data-close-button className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <div >
                        <h3>We need to know where you are in order to get your weather conditions</h3>
                        <div className="pre-body">
                            <button onClick={() => requestLocationPerms()}>Allow</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="overlay" className="active"></div>
        </>
    )
}

export default Modal;