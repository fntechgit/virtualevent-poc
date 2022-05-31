export const formatMasonry = (masonry) => {
    let leftColumn = 0, rightColumn = 0;
    let dummyImage = false
    masonry.map((image, index) => {
        if (index + 1 === masonry.length) {
            // If the last image makes both columns equals and the masonry array length is odd
            // add a dummy image to force the last image on the right side 
            if (image.size + rightColumn === leftColumn && masonry.length % 2 !== 0) {
                dummyImage = true;
            }
        } else {
            index % 2 === 0 ? leftColumn += image.size : rightColumn += image.size;
        }
    });
    const newMasonry = dummyImage ? [...masonry.slice(0, masonry.length - 1), { title: 'Dummy Image' }, masonry[masonry.length - 1]] : masonry;
    return newMasonry;
}
