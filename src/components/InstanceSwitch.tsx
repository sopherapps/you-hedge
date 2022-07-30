import React from "react";

interface ISwitchCaseProps {
    children: any,
    condition: any,
}

interface ISwitchProps {
    value: any,
    children: React.ReactElement<ISwitchCaseProps>[]
}

/**
 * Switch case for any parent Switch component. It is meant to be a child of any type of Switch
 * component e.g. InstanceSwitch
 */
export const SwitchCase: React.FC<ISwitchCaseProps> = ({ children }) => <>{children}</>;

/**
 * Switch display basing on the instance type of `value`. 
 * It will render nothing (or null) if the value is of an instance that is not provided for
 */
export const InstanceSwitch: React.FC<ISwitchProps> = ({ children, value }) => {
    return children.find(element => value instanceof element.props.condition) || null;
}

