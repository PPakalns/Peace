
function getBlocksInRadius(entity, dynamicLayer, radius) {
    let [tileX, tileY] = entity.getTileCoords(dynamicLayer)

    let foundTiles = []
    for (let r = -radius; r <= radius; r++)
    {
        for (let c = -radius; c <= radius; c++)
        {
            let tile = dynamicLayer.getTileAt(tileX + c, tileY + r)
            if (tile != null)
            {
                foundTiles.push(tile)
            }
        }
    }
    return foundTiles
}

export {
    getBlocksInRadius
}
