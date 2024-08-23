import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";
import { findByPropsLazy, findComponentByCodeLazy, findStoreLazy } from "@webpack";
import { i18n } from "@webpack/common";

const Icons = findByPropsLazy('QuestsIcon');
const Routes = findByPropsLazy('GUILD_MEMBER_VERIFICATION_FOR_HUB', 'QUEST_HOME');

const QuestsStore = findStoreLazy("QuestsStore");

const LinkButton = findComponentByCodeLazy("route:", ",selected:", ",icon:", ",iconClassName:");
const NumberBadge = findComponentByCodeLazy("count:", ",color:", ",disableColor:", ",shape:");

const QuestsButton = () => {
    const activeQuestsNotEnrolled = Array.from(QuestsStore.quests.values()).filter((quest: any) => {
        const expiresAt = new Date(quest.config.expiresAt).getTime();
        const currentTime = Date.now();
        const isExpired = expiresAt <= currentTime;
        const isEnrolled = quest.userStatus?.enrolledAt != null;

        return !isExpired && !isEnrolled;
    });

    return (
        <ErrorBoundary noop>
            <LinkButton
                text={i18n.Messages.QUESTS}
                icon={Icons.QuestsIcon}
                route={Routes.QUEST_HOME}
            >
                {activeQuestsNotEnrolled.length > 0 && (
                    <NumberBadge
                        count={activeQuestsNotEnrolled.length}
                    />
                )}
            </LinkButton>
        </ErrorBoundary>
    );
};

export default definePlugin({
    name: "QuestsHomeNav",
    description: "Adds a button to quickly go to quests in the DM list.",
    authors: [
        {
            id: 644298972420374528n,
            name: "Nick"
        }
    ],
    patches: [
        {
            find: "\"discord-shop\"",
            replacement: {
                match: /"discord-shop"\),/,
                replace: "$&,$self.QuestsButton(),"
            }
        }
    ],
    QuestsButton
});