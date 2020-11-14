// @flow
import { inject, observer } from "mobx-react";
import * as React from "react";

import { withTranslation } from "react-i18next";
import UsersStore from "stores/UsersStore";
import User from "models/User";
import { DropdownMenu, DropdownMenuItem } from "components/DropdownMenu";

type Props = {
  user: User,
  users: UsersStore,
};

@withTranslation()
@observer
class UserMenu extends React.Component<Props> {
  handlePromote = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
    const { user, users, t } = this.props;
    if (
      !window.confirm(
        t(
          "Are you want to make {{ userName }} an admin? Admins can modify team and billing information.",
          { userName: user.name }
        )
      )
    ) {
      return;
    }
    users.promote(user);
  };

  handleDemote = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
    const { user, users, t } = this.props;
    if (
      !window.confirm(
        t("Are you want to make {{ userName }} a member?", {
          userName: user.name,
        })
      )
    ) {
      return;
    }
    users.demote(user);
  };

  handleSuspend = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
    const { user, users, t } = this.props;
    if (
      !window.confirm(
        t(
          "Are you want to suspend this account? Suspended users will be prevented from logging in."
        )
      )
    ) {
      return;
    }
    users.suspend(user);
  };

  handleRevoke = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
    const { user, users } = this.props;
    users.delete(user, { confirmation: true });
  };

  handleActivate = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
    const { user, users } = this.props;
    users.activate(user);
  };

  render() {
    const { user, t } = this.props;

    return (
      <DropdownMenu>
        {user.isAdmin && (
          <DropdownMenuItem onClick={this.handleDemote}>
            {t("Make {{ userName }} a member…", { userName: user.name })}
          </DropdownMenuItem>
        )}
        {!user.isAdmin && !user.isSuspended && (
          <DropdownMenuItem onClick={this.handlePromote}>
            {t("Make {{ userName }} an admin…", { userName: user.name })}
          </DropdownMenuItem>
        )}
        {!user.lastActiveAt && (
          <DropdownMenuItem onClick={this.handleRevoke}>
            {t("Revoke invite…")}
          </DropdownMenuItem>
        )}
        {user.lastActiveAt &&
          (user.isSuspended ? (
            <DropdownMenuItem onClick={this.handleActivate}>
              {t("Activate account")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={this.handleSuspend}>
              {t("Suspend account…")}
            </DropdownMenuItem>
          ))}
      </DropdownMenu>
    );
  }
}

export default inject("users")(UserMenu);
