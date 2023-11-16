function generateRandomAvatarString() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let avatarId = '';

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        avatarId += characters.charAt(randomIndex);
    }

    return avatarId;
}

module.exports = {
    generateRandomAvatarString
}