import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import moment from "moment";

import IoAndroidMoreVertical from "react-icons/lib/io/android-more-vertical";
import { translations } from "../../../i18n";

import {
  Card,
  DropdownMenu,
  DropdownMenuItem,
  Loader,
  StatusIcon,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  Text
} from "../../../theme/index";

import EmptyState from "./EmptyState";
import { editDeviceDialogActions, removeDeviceDialogActions } from "apps/admin/store/actions";

const CalendarRowWrapper = styled(TableRow)`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const SingleDeviceRow = props => (
  <CalendarRowWrapper>
    <TableRowColumn onClick={props.onRowClicked} style={{ cursor: "pointer" }}>
      <Text block>
        {props.device.deviceType === "dashboard" && <em>Dashboard</em>}
        {props.device.deviceType === "calendar" && (props.calendar ? props.calendar.summary :
          <em>No calendar connected</em>)}
      </Text>
      <Text muted small>
        Added: {moment(props.device.createdTimestamp).format("MMM DD, YYYY ")}
      </Text>
    </TableRowColumn>
    <TableRowColumn onClick={props.onRowClicked} style={{ cursor: "pointer" }}>
      <Text block>
        {translations[props.device.language].language}
      </Text>
      <Text muted small>
        {props.device.clockType}h clock
      </Text>
    </TableRowColumn>
    <TableRowColumn onClick={props.onRowClicked} style={{ cursor: "pointer" }}>
      <Text>
        {props.device.deviceType === "dashboard" && <>
          <Text muted small>Highlight available rooms:</Text>
          <Text block>{props.device.showAvailableRooms ? "Yes" : "No"}</Text>
        </>
        }
        {props.device.deviceType === "calendar" && <>
          <Text muted small>Check-in required:</Text>
          <Text block>{props.device.minutesForCheckIn ? "Yes" : "No"}</Text>
        </>
        }
      </Text>
    </TableRowColumn>
    <TableRowColumn onClick={props.onRowClicked} style={{ cursor: "pointer" }}>
      <Text block>
        <StatusIcon success={props.device.isOnline} danger={!props.device.isOnline}/>
        {props.device.isOnline ? "Online" : "Offline"}
      </Text>
      <Text muted small>
        Seen {moment(Date.now() - props.device.msSinceLastActivity).fromNow()}
      </Text>
    </TableRowColumn>
    <TableRowColumn style={{ textAlign: "right" }}>
      <DropdownMenu trigger={<IoAndroidMoreVertical style={{ cursor: "pointer", color: "#555" }}/>}>
        <DropdownMenuItem onClick={props.onConfigureClicked}>Configure</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onDeleteClicked}>Disconnect</DropdownMenuItem>
      </DropdownMenu>
    </TableRowColumn>
  </CalendarRowWrapper>
);


const Devices = props => {
  if (!props.isLoaded) {
    return (
      <Card block style={{ textAlign: "center" }}>
        <Loader/>
      </Card>
    );
  }

  if (props.isLoaded && props.devices.length === 0) {
    return <EmptyState/>;
  }

  const rows = props.devices.map(device => (
    <SingleDeviceRow
      key={device.id}
      onRowClicked={() => props.onConfigureDeviceClicked && props.onConfigureDeviceClicked(device)}
      onConfigureClicked={() => props.onConfigureDeviceClicked && props.onConfigureDeviceClicked(device)}
      onDeleteClicked={() => props.onDeleteDeviceClicked && props.onDeleteDeviceClicked(device)}
      device={device}
      calendar={props.calendars[device.calendarId]}
    />
  ));

  return (
    <Card block compact>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Calendar</TableHeaderColumn>
            <TableHeaderColumn>Locale</TableHeaderColumn>
            <TableHeaderColumn>Settings</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn style={{ width: 50 }}/>
          </TableRow>
        </TableHeader>
        <TableBody children={rows}/>
      </Table>
    </Card>
  );
};

const mapStateToProps = state => ({
  isLoaded: state.devices.isLoaded,
  devices: state.devices.data,
  calendars: state.calendars
});

const mapDispatchToProps = dispatch => ({
  onConfigureDeviceClicked: device => dispatch(editDeviceDialogActions.show(device)),
  onDeleteDeviceClicked: device => dispatch(removeDeviceDialogActions.show(device))
});

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
