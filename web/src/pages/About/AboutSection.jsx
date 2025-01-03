import React from "react";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <h1>About Us</h1>
      <div className="about-container">
        <img
          src="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Beach"
          className="about-image"
        />
        <div className="about-text">
          <p>
            Welcome to INTEGRA SHOP, your number one source for all things
            products. We're dedicated to giving you the very best of product
            category, with a focus on dependability, customer service, and
            uniqueness.
          </p>
          <p>
            Founded in [Year] by [Founder's Name], [Your Brand Name] has come a
            long way from its beginnings in [location or story behind the
            brand]. When [Founder's Name] first started out, their passion for
            [passion or mission] drove them to quit their day job, and gave them
            the impetus to turn hard work and inspiration into a booming online
            store.
          </p>
          <p>
            We now serve customers all over [location or market], and are
            thrilled to be a part of the quirky, eco-friendly, fair trade wing
            of the [industry].
          </p>
        </div>
      </div>
      <div style={{ padding:0}} className="mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to [your mission statement]. We believe in [values or
          principles], and strive to [what you hope to achieve for your
          customers]. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quibusdam cum voluptatum similique repudiandae optio harum ut
          asperiores iste voluptatibus commodi eum totam vero maxime explicabo,
          molestiae sunt earum quam quidem!

          {/* <br /><br /><br /> */}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
