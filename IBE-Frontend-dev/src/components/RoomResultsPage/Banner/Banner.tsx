import './Banner.scss';
import backgroundImage from '../../../assets/resort.jpg';

export function Banner() {
    return (
        <div className="banner-container">
            <img src = {backgroundImage} alt = "banner-image" />
        </div>
    );
}