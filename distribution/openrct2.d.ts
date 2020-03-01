/*****************************************************************************
 * Copyright (c) 2014-2020 OpenRCT2 developers
 *
 * For a complete list of all authors, please refer to contributors.md
 * Interested in contributing? Visit https://github.com/OpenRCT2/OpenRCT2
 *
 * OpenRCT2 is licensed under the GNU General Public License version 3.
 *****************************************************************************/

// OpenRCT2 Scripting API definition file

// To enable IntelliSense for your scripts in Visual Studio or Visual Studio Code,
// add the following line to the top of your script and change the path appropriately.
//
//   /// <reference path="/path/to/openrct2.d.ts" />
//

export type PluginType = "local" | "remote";

declare global {
    interface PluginMetadata {
        name: string;
        version: string;
        authors: string | string[];
        type: PluginType;
        minApiVersion?: number;
        main: () => void;
    }

    interface Console {
        clear(): void;
        log(message?: any, ...optionalParams: any[]): void;
    }

    interface Configuration {
        getAll(pattern: string): { [name: string]: any };
        get<T>(key: string): T | undefined;
        get<T>(key: string, defaultValue: T): T;
        set<T>(key: string, value: T): void;
        has(key: string): boolean;
    }

    interface Coord2 {
        x: number;
        y: number;
    }

    interface Coord3 {
        x: number;
        y: number;
        z: number;
    }

    type HookType =
        "interval.tick" | "interval.day" |
        "network.chat" | "network.action" | "network.join" | "network.leave";

    type ExpenditureType =
        "ride_construction" |
        "ride_runningcosts" |
        "land_purchase" |
        "landscaping" |
        "park_entrance_tickets" |
        "park_ride_tickets" |
        "shop_sales" |
        "shop_stock" |
        "food_drink_sales" |
        "food_drink_stock" |
        "wages" |
        "marketing" |
        "research" |
        "interest";

    interface GameActionResult {
        error: string;
        errorTitle?: string;
        errorMessage?: string;
        position: Coord3;
        cost: number;
        expenditureType: ExpenditureType;
    }

    interface GameActionDesc {
        id: string;
        query: (args: object) => GameActionResult;
        execute: (args: object) => GameActionResult;
    }

    interface NetworkEventArgs {
        readonly player: number;
    }

    interface NetworkActionEventArgs extends NetworkEventArgs {
        readonly type: string;
        result: GameActionResult;
    }

    interface NetworkChatEventArgs extends NetworkEventArgs {
        message: string;
    }

    interface Context {
        /**
         * The user's current configuration.
         */
        configuration: Configuration;

        /**
         * Shared generic storage for all plugins.
         */
        sharedStorage: Configuration;

        /**
         * Local generic storage for a each plugin.
         */
        localStorage: Configuration;

        /**
         * Registers a new intent (command) that can be mapped to a shortcut.
         */
        registerIntent(desc: IntentDesc): void;

        /**
         * Registers a new game action that allows clients to interact with the game.
         */
        registerGameAction(desc: GameActionDesc): void;

        /**
         * Query the result of running a game action. This allows you to check the outcome and validity of
         * an action without actually executing it.
         * @param action The name of the action.
         * @param args The action parameters.
         * @param callback The function to be called with the result of the action.
         */
        queryAction(action: string, args: object, callback: (result: GameActionResult) => void): void;

        /**
         * Executes a game action. In a network game, this will send a request to the server and wait
         * for the server to reply.
         * @param action The name of the action.
         * @param args The action parameters.
         * @param callback The function to be called with the result of the action.
         */
        executeAction(action: string, args: object, callback: (result: GameActionResult) => void): void;

        /**
         * Subscribes to the given hook.
         */
        subscribe(hook: HookType, callback: Function): IDisposable;

        subscribe(hook: "interval.tick", callback: () => void): IDisposable;
        subscribe(hook: "interval.day", callback: () => void): IDisposable;
        subscribe(hook: "network.action", callback: (e: NetworkActionEventArgs) => void): IDisposable;
        subscribe(hook: "network.chat", callback: (e: NetworkChatEventArgs) => void): IDisposable;
        subscribe(hook: "network.join", callback: (e: NetworkEventArgs) => void): IDisposable;
        subscribe(hook: "network.leave", callback: (e: NetworkEventArgs) => void): IDisposable;
    }

    interface IntentDesc
    {
        key: string;
        title?: string;
        shortcut?: string;
        action: Function;
    }

    interface IDisposable {
        dispose(): void;
    }

    type TileElementType =
        "surface" | "footpath" | "track" | "small_scenery" | "wall" | "entrance" | "large_scenery" | "banner";

    interface BaseTileElement {
        type: TileElementType;
        baseZ: number;
        clearanceZ: number;
    }

    interface SurfaceElement extends BaseTileElement {
        slope: number;
        surfaceStyle: number;
        edgeStyle: number;
        waterHeight: number;
        grassLength: number;
        ownership: number;
        parkFences: number;

        readonly hasOwnership: boolean;
        readonly hasConstructionRights: boolean;
    }

    interface FootpathAdditionStatus extends BaseTileElement {
        north: number;
        east: number;
        south: number;
        west: number;
    }

    interface FootpathAddition extends BaseTileElement {
        isBin: boolean;
        isBench: boolean;
        isLamp: boolean;
        isBreakable: boolean;
        isJumpingFountainWater: boolean;
        isJumpingFountainSnow: boolean;
        allowedOnQueue: boolean;
        allowedOnSlope: boolean;
        isQueueScreen: boolean;
        status: FootpathAdditionStatus;

        /**
         * Remove the path addition
         */
        remove(): void;
    }

    interface FootpathElement extends BaseTileElement {
        footpathType: number;
        isSloped: boolean;
        isQueue: boolean;
        addition: FootpathAddition;
        edges: number;
        corners: number;
        rideIndex: number;
    }

    interface TrackElement extends BaseTileElement {
        trackType: number;
        sequence: number;
        ride: number;
        station: number;
        hasChainLift: boolean;
    }

    interface SmallSceneryElement extends BaseTileElement {
        object: number;
        primaryColour: number;
        secondaryColour: number;
    }

    interface EntranceElement extends BaseTileElement {
        object: number;
        sequence: number;
        ride: number;
        station: number;
    }

    interface WallElement extends BaseTileElement {
        object: number;
    }

    interface LargeSceneryElement extends BaseTileElement {
        object: number;
        primaryColour: number;
        secondaryColour: number;
    }

    interface BannerElement extends BaseTileElement {
    }

    interface CorruptElement extends BaseTileElement {
    }

    type TileElement = SurfaceElement | FootpathElement | TrackElement;

    /**
     * Represents a tile containing tile elements on the map. This is a fixed handle
     * for a given tile position. It can be re-used safely between game ticks.
     */
    interface Tile {
        /** The x position in tiles. */
        readonly x: number;
        /** The y position in tiles. */
        readonly y: number;
        /** Gets an array of all the tile elements on this tile. */
        readonly elements: TileElement[];
        /** Gets the number of tile elements on this tile. */
        readonly numElements: number;
        /**
         * Gets or sets the raw data for this tile.
         * This can provide more control and efficiency for tile manipulation but requires
         * knowledge of tile element structures and may change between versions of OpenRCT2.
         */
        data: Uint8Array;

        /** Gets the tile element at the given index on this tile. */
        getElement(index: number): TileElement;
        /** Gets the tile element at the given index on this tile. */
        getElement<T extends BaseTileElement>(index: number): T;
        /** Inserts a new tile element at the given index on this tile. */
        insertElement(index: number): TileElement;
        /** Removes the tile element at the given index from this tile. */
        removeElement(index: number): void;
    }

    /**
     * Represents the definition of a loaded object (.DAT or .json) such a ride type or scenery item.
     */
    interface Object {
        /**
         * The unique name identifier of the object, e.g. "BURGB   ".
         * This may have trailing spaces if the name is shorter than 8 characters.
         */
        readonly identifier: string;
        /**
         * The name in the user's current language.
         */
        readonly name: string;
    }

    /**
     * Represents the object definition of a ride or stall.
     */
    interface RideObject extends Object {
        /**
         * The description of the ride / stall in the player's current language.
         */
        readonly description: string;
        /**
         * A text description describing the capacity of the ride in the player's current language.
         */
        readonly capacity: string;
    }

    /**
     * Represents a ride or stall within the park.
     */
    interface Ride {
        /**
         * The object metadata for this ride.
         */
        readonly object: RideObject;
        /**
         * The unique ID / index of the ride.
         */
        readonly id: number;
        /**
         * The type of the ride represented as the internal built-in ride type ID.
         */
        type: number;
        /**
         * The generated or custom name of the ride.
         */
        name: string;
        /**
         * The excitement metric of the ride represented as a 2 decimal point fixed integer.
         * For example, `652` equates to `6.52`.
         */
        excitement: number;
        /**
         * The intensity metric of the ride represented as a 2 decimal point fixed integer.
         * For example, `652` equates to `6.52`.
         */
        intensity: number;
        /**
         * The nausea metric of the ride represented as a 2 decimal point fixed integer.
         * For example, `652` equates to `6.52`.
         */
        nausea: number;
        /**
         * The total number of customers the ride has served since it was built.
         */
        totalCustomers: number;
    }

    type ThingType =
        "car" | "duck" | "peep";

    /**
     * Represents an object "thing" on the map that can typically moves and has a sub-tile coordinate.
     */
    interface Thing {
        /**
         * The type of thing, e.g. car, duck, litter, or peep.
         */
        readonly type: ThingType;
        /**
         * The x-coordinate of the thing in game units.
         */
        x: number;
        /**
         * The y-coordinate of the thing in game units.
         */
        y: number;
        /**
         * The z-coordinate of the thing in game units.
         */
        z: number;
    }

    /**
     * Represents a guest or staff member.
     */
    interface Peep extends Thing {
        /**
         * Colour of the peep's t-shirt.
         */
        tshirt: number;
        /**
         * Colour of the peep's trousers.
         */
        trousers: number;
    }

    interface GameMap {
        readonly size: Coord2;
        readonly numRides: number;
        readonly numThings: number;
        readonly rides: Ride[];

        getRide(id: number): Ride;
        getTile(x: number, y: number): Tile;
        getThing(id: number): Thing;
        getAllThings(type: ThingType);
    }

    type ParkMessageType =
        "attraction" | "peep_on_attraction" | "peep" | "money" | "blank" | "research" | "guests" | "award" | "chart";

    interface ParkMessage {
        type: ParkMessageType;
        text: string;
    }

    interface Park {
        cash: number;
        rating: number;
        bankLoan: number;
        maxBankLoan: number;

        postMessage(message: string): void;
        postMessage(message: ParkMessage): void;
    }

    /**
     * User Interface APIs
     * These will only be available to servers and clients that are not running headless mode.
     * Plugin writers should check if ui is available using `typeof ui !== 'undefined'`.
     */

    /**
     * Represents the type of a widget, e.g. button or label.
     */
    type WidgetType =
        "button" | "checkbox" | "dropdown" | "groupbox" | "label" | "spinner" | "tabview" | "viewport";

    interface Widget {
        type: WidgetType;
        x: number;
        y: number;
        width: number;
        height: number;
        name?: string;
        isDisabled?: boolean;
    }

    interface ButtonWidget extends Widget {
        image: number;
        text: string;
        onClick: () => void;
    }

    interface CheckboxWidget extends Widget {
        text: string;
        isChecked: number;
        onChanged: (isChecked: boolean) => void;
    }

    interface DropdownWidget extends Widget {
        items: string[];
        selectedIndex: number;
        onChanged: (index: number) => void;
    }

    interface LabelWidget extends Widget {
        text: string;
        onChanged: (index: number) => void;
    }

    interface SpinnerWidget extends Widget {
        text: string;
        onDecrement: () => void;
        onIncrement: () => void;
    }

    interface ViewportWidget extends Widget {
        viewport: Viewport
    }

    interface Tab {
        image: number;
        tooltip: string;
        widgets: Widget[];
    }

    interface Window {
        classification: number;
        number: number;
        x: number;
        y: number;
        width: number;
        height: number;
        isSticky: boolean;
        colours: number[];
        title: string;
        widgets: Widget[];

        close(): void;
        bringToFront(): void;
        findWidget<T extends Widget>(name: string): T;
    }

    interface TabbedWindow extends Window {
        tabs: Tab[];
        activeTabIndex: number;

        onTabChanged: (index: number) => void;
    }

    interface WindowDesc {
        classification: string;
        x?: number;
        y?: number;
        width: number;
        height: number;
        title: string;
        id?: number;
        minWidth?: number;
        minHeight?: number;
        widgets?: Widget[];
        colours?: number[];
        tabs?: Tab[];

        onClose?: () => void;
    }

    type ToolCallbackType = "move" | "press" | "release";

    interface ToolCallback {
        type: ToolCallbackType;
        tiles: Coord2[];
    }

    type CursorType =
        "arrow" |
        "blank" |
        "up_arrow" |
        "up_down_arrow" |
        "hand_point" |
        "zzz" |
        "diagonal_arrows" |
        "picker" |
        "tree_down" |
        "fountain_down" |
        "statue_down" |
        "bench_down" |
        "cross_hair" |
        "bin_down" |
        "lamppost_down" |
        "fence_down" |
        "flower_down" |
        "path_down" |
        "dig_down" |
        "water_down" |
        "house_down" |
        "volcano_down" |
        "walk_down" |
        "paint_down" |
        "entrance_down" |
        "hand_open" |
        "hand_closed";

    interface ToolDesc {
        id: string;
        cursor: CursorType;
        width: number;
        height: number;
        callback: (e: ToolCallback) => void;
    }

    interface Viewport {
        left: number;
        top: number;
        right: number;
        bottom: number;
        rotation: number;
        zoom: number;
        visibilityFlags: number;

        getCentrePosition(): Coord2;
        moveTo(position: Coord2 | Coord3): void;
        scrollTo(position: Coord2 | Coord3): void;
    }

    interface Ui {
        readonly width: number;
        readonly height: number;
        readonly windows: number;
        readonly mainViewport: Viewport;

        getWindow(id: number): Window;
        getWindow(classification: string, id?: number): Window;
        openWindow(desc: WindowDesc): Window;
        closeWindows(classification: string, id?: number): void;
        closeAllWindows(): void;

        activateTool(options: ToolDesc): IDisposable;
        registerMenuItem(text: string, callback: () => void): void;
    }

    /**
     * Network APIs
     * Use `network.status` to determine whether the current game is a client, server or in single player mode.
     */

    /**
     * Represents a player within a network game.
     */
    interface Player {
        readonly id: number;
        readonly name: string;
        group: number;
        readonly ping: number;
        readonly commandsRan: number;
        readonly moneySpent: number;
    }

    type PermissionType =
        "chat" |
        "terraform" |
        "set_water_level" |
        "toggle_pause" |
        "create_ride" |
        "remove_ride" |
        "build_ride" |
        "ride_properties" |
        "scenery" |
        "path" |
        "clear_landscape" |
        "guest" |
        "staff" |
        "park_properties" |
        "park_funding" |
        "kick_player" |
        "modify_groups" |
        "set_player_group" |
        "cheat" |
        "toggle_scenery_cluster" |
        "passwordless_login" |
        "modify_tile" |
        "edit_scenario_options";

    interface PlayerGroup {
        readonly id: number;
        name: string;
        permissions: PermissionType[];
    }

    interface ServerInfo {
        readonly name: string;
        readonly description: string;
        readonly greeting: string;
        readonly providerName: string;
        readonly providerEmail: string;
        readonly providerWebsite: string;
    }

    type NetworkMode = "none" | "server" | "client";

    interface Network {
        readonly mode: NetworkMode;
        readonly groups: number;
        readonly players: number;
        defaultGroup: number;

        getServerInfo(): ServerInfo;
        getGroup(index: number): PlayerGroup;
        setGroups(groups: PlayerGroup[]): void;
        getPlayer(index: number): Player;
        kickPlayer(index: number): void;
        sendMessage(message: string): void;
        sendMessage(message: string, players: number[]): void;
    }

    interface GameDate {
        /**
         * The total number of ticks that have elapsed since the beginning of the game / scenario. This
         * should never reset.
         */
        readonly ticksElapsed: number;
        /**
         * The total number of months that have elapsed. This will equate to 16 on 1st March, Year 2.
         * Note: this represents the current date and may be reset by cheats or scripts.
         */
        monthsElapsed: number;
        /**
         * The total number of years that have elapsed. This always equates to (monthsElapsed / 8).
         */
        readonly yearsElapsed: number;

        /**
         * How far through the month we are between 0 and 65536. This is incremented by 4 each tick, so
         * every month takes ~6.8 minutes to complete making a year take just under an hour.
         */
        monthProgress: number;

        /** The day of the month from 1 to 31. */
        readonly day: number;
        /** The current month of the year from 0 to 7, where 0 is March and 7 is October. */
        readonly month: number;
        /** The current year starting from 1. */
        readonly year: number;
    }

    /**
     * Global context for accessing all other APIs.
     */
    var console: Console;
    var context: Context;
    var date: GameDate;
    var map: GameMap;
    var network: Network;
    var park: Park;
    var ui: Ui;

    /**
     * Registers the plugin. This only only be called once.
     * @param metadata Information about the plugin and the entry point.
     */
    function registerPlugin(metadata: PluginMetadata): void;
}
