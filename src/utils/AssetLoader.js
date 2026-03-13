import { assetsConfig } from "../configs/assetsConfig.js"

export class AssetLoader {

    static load(scene){

        Object.values(assetsConfig).forEach(category => {

            const path = category.path
            const prefix = category.prefix || ""

            category.files.forEach(name => {

                let fileName

                if(category.getFile){
                    fileName = category.getFile(name)
                }
                else{
                    fileName = `${name}.png`
                }

                scene.load.image(
                    `${prefix}${name}`,
                    path + fileName
                )

            })

        })

    }

}