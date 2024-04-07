import { ApplicationCommandInputType } from "@api/Commands";
import { sendMessage } from "@utils/discord";
import definePlugin from "@utils/types";
import { RestAPI } from "@webpack/common";

async function getRandomBunnyGirl() {
    return new Promise((resolve, reject) => {
        RestAPI.get({
            url: `/gifs/search`,
            query: {
                q: 'bunny girl'
            }
        }).then(response => {
            if (!response.ok) {
                reject(new Error('Failed to fetch GIFs'));
            } else {
                resolve(response.body[Math.floor(Math.random() * response.body.length)].url);
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export default definePlugin({
    name: "Bunny Girls",
    description: "Adds a command to post a random gif of a bunny girl.",
    authors: [
        {
            id: 644298972420374528n,
            name: "Nick"
        }
    ],
    dependencies: ["CommandsAPI"],
    commands: [
        {
            inputType: ApplicationCommandInputType.BUILT_IN,
            name: "bunnygirl",
            description: "Send a random gif of a bunny girl.",
            execute: async (_, ctx) => {
                const gifUrl = await getRandomBunnyGirl();

                sendMessage(ctx.channel.id, {
                    content: `${gifUrl}`
                });
            }
        }
    ]
});