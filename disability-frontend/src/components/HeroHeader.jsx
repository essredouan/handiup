import React from 'react';

const HeroHeader = () => {
  return (
    <section style={styles.hero}>
      <h2>Welcome to Disability Platform</h2>
      <p>Supporting and empowering the community</p>
    </section>
  );
};

const styles = {
  hero: {
    backgroundColor: '#e9ecef',
    padding: '40px 20px',
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default HeroHeader;
