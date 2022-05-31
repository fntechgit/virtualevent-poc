export const formatMasonry = (masonry) => {
    let leftColumn = 0, rightColumn = 0;
    let dummyImage = false
    masonry.map((image, index) => {
        if (index + 1 === masonry.length) {
            if (image.size + leftColumn !== rightColumn) {
                dummyImage = true;
            }
        } else {
            index % 2 === 0 ? leftColumn += image.size : rightColumn += image.size;
        }
    });
    const newMasonry = dummyImage ? [...masonry.slice(0, masonry.length - 1), { title: 'Dummy Image' }, masonry[masonry.length - 1]] : masonry;
    return newMasonry;
}
