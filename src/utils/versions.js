function incrementVersion(version) {
    const parts = version.split('.');
    const major = parseInt(parts[0].substring(1), 10);
    let minor = parseInt(parts[1], 10);
    let patch = parseInt(parts[2], 10);

    if (patch === 9) {
        patch = 0;
        minor++;
    } else {
        patch++;
    }

    return `V${major}.${minor}.${patch}`;
}

module.exports = { incrementVersion };