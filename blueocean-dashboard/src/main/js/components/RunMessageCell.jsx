import React, { Component, PropTypes } from 'react';
import Lozenge from './Lozenge';

export default class RunMessageCell extends Component {
    propTypes = {
        run: PropTypes.object,
        t: PropTypes.func,
    };

    render() {
        const run = this.props.run;
        const t = this.props.t;
        let message;

        // Note that the order that this is evaluated is important for providing a relevant message to the user

        // 1. If the user has set a message then we always show it
        const showUserDefinedMessage = run && run.description;

        // 2. Show commit messages if available
        //    however if a run has > 1 cause then the cause is likely more important than the change set (e.g. replay)
        const showCommitMessage = run && run.changeSet && (run.changeSet && run.changeSet.length > 0) && (run.causes && run.causes.length <= 1);

        // 3. Lastly if there are any causes, display the last cause available
        const showCauses = run && (run.causes && run.causes.length > 0);

        if (showUserDefinedMessage) {
            message = (<span className="RunMessageCell" title={run.description}><span className="RunMessageCellInner">{run.description}</span></span>);
        } else if (showCommitMessage) {
            const commitMsg = run.changeSet[run.changeSet.length - 1].msg;
            if (run.changeSet.length > 1) {
                return (<span className="RunMessageCell" title={commitMsg}><span className="RunMessageCellInner">{commitMsg}</span> <Lozenge title={t('lozenge.commit', {0: run.changeSet.length})}/></span>);
            } else {
                return (<span className="RunMessageCell" title={commitMsg}><span className="RunMessageCellInner">{commitMsg}</span></span>);
            }
        } else if (showCauses) {
            // Last cause is always more significant than the first
            const cause = run.causes[run.causes.length-1].shortDescription;
            return (<span className="RunMessageCell" title={cause}><span className="RunMessageCellInner">{cause}</span></span>)
        } else {
            message = (<span className="RunMessageCell"><span className="RunMessageCellInner">–</span></span>);
        }
        return message;
    }
}
