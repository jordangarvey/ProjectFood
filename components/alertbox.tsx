import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AlertBox(props: { alert: string; }) {
	const { alert } = props;

	return (
		<Alert variant="destructive">
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{alert}</AlertDescription>
		</Alert>
	);
}

export default AlertBox;
