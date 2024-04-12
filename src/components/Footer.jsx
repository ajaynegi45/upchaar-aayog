import "./footer.css"

function Footer() {
    return (
        <div className={"footer"}>
            <p>Developed with ❤️ by Codies Coder</p>
            <p>©️ {(new Date().getFullYear())} Upchaar Aayog</p>
        </div>
    );
}

export default Footer;