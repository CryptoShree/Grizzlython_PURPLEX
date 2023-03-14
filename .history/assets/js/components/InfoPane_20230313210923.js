import React from 'react'
import classNames from 'classnames'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import parseISO from 'date-fns/parseISO'
import h3 from 'h3-js/dist/h3-js';

function InfoPane(props) {
    const [showLegendPane, setShowLegendPane] = React.useState(false)
    const onLegendClick = () => setShowLegendPane(!showLegendPane)
    const locale = navigator.language;

    function hotspotCount() {
        return props.uplinks.length
    }

    function recentTime() {
        let sortedTimes = props.uplinks;
        sortedTimes.sort((a,b) => -a.timestamp.localeCompare(b.timestamp))

        let distTimeFull = formatDistanceToNowStrict(parseISO(sortedTimes[0].timestamp))
        
        let distTimeValue = distTimeFull.split(" ")[0]; //get the value e.g. "3 hours" => "3"
        
        let distTimeUnit = distTimeFull.split(" ")[1]; //get the unit e.g. "3 hours" => "hours"
        let distTimeUnitUppercase = distTimeUnit.charAt(0).toUpperCase() + distTimeUnit.slice(1);

        let timeInfo = {
            full: distTimeFull,
            number: distTimeValue,
            unit: distTimeUnitUppercase
        }
        return timeInfo
    }

    function uplinkDistance(uplinkLat, uplinkLng) {
        // hotspots are res8, find the parent res8 from the res9 selected hex  
        let selectedHex = h3.h3ToParent(props.hexId, 8);
        // Create the res8 from provided coordinates
        let hotspotHex = h3.geoToH3(uplinkLat, uplinkLng, 8);

        // if the mapped hex is within the hotspot hex return a null result.
        if (selectedHex == hotspotHex) {
            let result = {
                number: "–",
                unit: ""
            }
            return result
        } else { //compute the distance
            let point1 = [uplinkLat, uplinkLng];
            let point2 = h3.h3ToGeo(props.hexId);
            let result = {};
            let dist = 0;
            let unit = "km";
            if (locale == 'en-US') {
                // 🇺🇸 freedom units
                dist = h3.pointDist(point1, point2, h3.UNITS.km) / 1.609;
                unit = "mi"
            } else {
                dist = h3.pointDist(point1, point2, h3.UNITS.km); // si
            }
            if (dist < 1) {
                result = {
                    number: dist.toFixed(1),
                    unit: unit
                }
            } else {
                result = {
                    number: Math.round(dist),
                    unit: unit
                }
            }
            return result
        }
    }

    function deKebab(string){
        return string
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    }

    return (
        <div className="info-pane">
            <div className={classNames("pane-nav", {
                 "has-subcontent": showLegendPane || props.showHexPane
            })}>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"  width="300pt" height="200pt" viewBox="0 0 00.000000 60.000000"> 
                    
<g transform="translate(0.000000,0.000000) scale(0.10000,-0.10000)" fill="#FFFFFF" stroke="none"> 
<path d="M2059 1405 c-104 -33 -201 -128 -236 -230 -20 -57 -22 -161 -5 -220 19 -66 74 -147 127 -187 148 -113 349 -98 480 36 72 75 99 143 99 256 0 75 -4 93 -32 151 -60 125 -174 200 -312 206 -47 2 -92 -3 -121 -12z m223 -35 c73 -27 151 -102 184 -176 54 -118 28 -280 -58 -365 -56 -55 -75 -68 -138 -89 -71 -24 -110 -25 -184 -6 -126 33 -221 135 -246 264 -18 91 15 213 78 283 84 94 245 134 364 89z"/> <path d="M2251 1288 c-23 -11 -41 -24 -41 -28 0 -4 -27 -11 -60 -15 -99 -11 -163 -78 -175 -182 -3 -23 -16 -59 -30 -79 -30 -44 -32 -78 -5 -122 34 -56 108 -69 157 -28 17 15 48 27 73 30 103 12 179 83 180 167 0 22 11 52 29 80 44 66 45 104 4 149 -41 44 -82 53 -132 28z m88 -23 c58 -29 61 -105 7 -141 -23 -14 -25 -21 -20 -55 5 -28 1 -50 -16 -83 -28 -59 -77 -89 -144 -90 -43 -1 -55 -5 -77 -30 -18 -21 -35 -29 -58 -29 -75 0 -111 96 -53 145 23 19 27 31 27 74 0 97 87 176 179 161 28 -4 36 -1 46 18 12 23 43 43 68 44 7 1 26 -6 41 -14z"/> <path d="M2262 1228 c-6 -7 -12 -26 -14 -43 -3 -30 -3 -30 -61 -27 -54 4 -59 2 -93 -32 -33 -33 -35 -38 -32 -93 3 -58 3 -58 -27 -61 -40 -5 -55 -19 -55 -51 0 -34 17 -51 51 -51 32 0 46 15 51 55 3 30 3 30 66 30 60 0 66 2 94 34 27 30 29 39 26 90 -3 56 -3 56 27 59 17 2 36 8 43 14 15 13 16 60 0 76 -16 16 -63 15 -76 0z m-55 -132 c24 -21 26 -27 18 -52 -6 -16 -22 -35 -36 -43 -24 -13 -29 -13 -53 2 -34 23 -37 78 -4 101 30 21 42 20 75 -8z"/> <path d="M740 1333 l-286 -3 -63 -61 c-35 -33 -61 -62 -58 -65 3 -3 137 -5 299 -4 l293 1 62 61 c34 34 60 65 57 70 -3 4 -8 7 -12 6 -4 -2 -135 -4 -292 -5z m230 -33 c0 -15 -42 -60 -56 -60 -8 0 -14 -3 -14 -7 0 -13 -479 -13 -487 -1 -3 7 10 26 32 45 l39 34 243 -2 c134 -1 243 -5 243 -9z"/> <path d="M1285 1211 l-29 -31 62 -63 63 -63 -61 -58 -61 -59 23 -26 c13 -14 24 -28 26 -30 1 -3 31 23 66 58 l63 62 61 -63 61 -63 30 31 31 31 -64 59 -64 59 61 62 61 63 -27 28 -28 29 -60 -63 -61 -62 -61 65 -62 65 -30 -31z m77 -64 c18 -18 45 -38 59 -44 24 -10 31 -7 74 28 68 56 74 53 20 -11 -43 -52 -44 -82 -5 -122 17 -16 30 -34 30 -39 0 -5 5 -9 10 -9 6 0 10 -5 10 -11 0 -6 -18 5 -39 24 -74 67 -84 67 -163 5 -45 -35 -50 -27 -9 13 26 25 41 51 47 86 1 7 -18 33 -42 58 -24 25 -44 48 -44 50 0 14 23 1 52 -28z"/> <path d="M330 1121 c0 -5 28 -36 63 -70 l62 -61 298 0 c163 0 297 2 297 4 0 2 -30 34 -67 70 l-68 66 -292 0 c-168 0 -293 -4 -293 -9z m612 -58 c17 -18 30 -35 27 -38 -10 -9 -453 -12 -488 -2 -35 9 -70 41 -71 64 0 10 56 12 250 10 l250 -2 32 -32z"/> <path d="M393 856 c-35 -33 -63 -63 -63 -68 0 -4 134 -8 298 -8 l298 0 64 65 c35 36 60 65 55 65 -6 1 -140 2 -300 3 l-290 2 -62 -59z m556 26 l22 -8 -21 -27 c-12 -14 -38 -31 -58 -36 -43 -10 -477 -10 -487 1 -4 4 9 22 30 41 l37 34 227 2 c126 1 238 -2 250 -7z"/> </g> </svg> 
                <ul className="nav-links">
                    <li className="nav-link">
                        <button onClick={onLegendClick}>Legend</button>
                    </li>
                    <li className="nav-link">
                        <a href="https://docs.helium.com/use-the-network/coverage-mapping" target="_blank">Docs</a>
                    </li>
                    <li className="nav-link">
                        <a href="https://github.com/helium/mappers" target="_blank">GitHub</a>
                    </li>
                </ul>
            </div>
            { showLegendPane &&
                <div className="legend">
                    <div className="legend-line">
                        <span className="legend-item type-smallcap">RSSI</span>
                        <div className="legend-item">
                            <svg className="legend-icon legend-dBm-low" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L13.0622 3.5V10.5L7 14L0.937822 10.5V3.5L7 0Z" />
                            </svg>
                            <span>-120<span className="stat-unit"> dBm</span></span>
                        </div>
                        <div className="legend-item">
                            <svg className="legend-icon legend-dBm-medium" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L13.0622 3.5V10.5L7 14L0.937822 10.5V3.5L7 0Z" />
                            </svg>
                            <span>-100<span className="stat-unit"> dBm</span></span>
                        </div>
                        <div className="legend-item">
                            <svg className="legend-icon legend-dBm-high" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L13.0622 3.5V10.5L7 14L0.937822 10.5V3.5L7 0Z" />
                            </svg>
                            <span>-80<span className="stat-unit"> dBm</span></span>
                        </div>
                    </div>

                    <div className="legend-line">
                        <div className="legend-item">
                            <svg className="legend-icon legend-mapper-witness" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L13.0622 3.5V10.5L7 14L0.937822 10.5V3.5L7 0Z" />
                            </svg>
                            <span>Mapper Witness</span>
                        </div>
                    </div>

                    <div className="legend-line">
                        <div className="legend-item">
                            <svg className="legend-icon legend-hotspot" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L13.0622 3.5V10.5L7 14L0.937822 10.5V3.5L7 0Z" />
                            </svg>
                            <span>Hotspot</span>
                        </div>
                    </div>
                </div>
            }
            { props.showHexPane &&
                <div className="main-stats">
                    <div className="stats-heading">
                        <span>Hex Statistics</span>
                        { props.showHexPaneCloseButton &&
                            <button className="close-button" onClick={props.onCloseHexPaneClick}>
                                <svg className="icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.9998 6.54957L13.4284 1.12096C13.8289 0.720422 14.4783 0.720422 14.8789 1.12096C15.2794 1.5215 15.2794 2.1709 14.8789 2.57144L9.45028 8.00004L14.8789 13.4287C15.2794 13.8292 15.2794 14.4786 14.8789 14.8791C14.4783 15.2797 13.8289 15.2797 13.4284 14.8791L7.9998 9.45052L2.57119 14.8791C2.17065 15.2797 1.52125 15.2797 1.12072 14.8791C0.720178 14.4786 0.720178 13.8292 1.12072 13.4287L6.54932 8.00004L1.12072 2.57144C0.720178 2.1709 0.720178 1.5215 1.12072 1.12096C1.52125 0.720422 2.17065 0.720422 2.57119 1.12096L7.9998 6.54957Z" />
                                </svg>
                            </button>
                        }
                    </div>
                    <div className="h3-holder">
                        <svg className="hex-icon" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.5 1.86603C10.4282 1.33013 11.5718 1.33013 12.5 1.86603L19.0263 5.63397C19.9545 6.16987 20.5263 7.16025 20.5263 8.23205V15.7679C20.5263 16.8397 19.9545 17.8301 19.0263 18.366L12.5 22.134C11.5718 22.6699 10.4282 22.6699 9.5 22.134L2.97372 18.366C2.04552 17.8301 1.47372 16.8397 1.47372 15.7679V8.23205C1.47372 7.16025 2.04552 6.16987 2.97372 5.63397L9.5 1.86603Z" stroke="#B680FD" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                        <span className="h3id">{props.hexId}</span>

                    </div>
                    <div className="big-stats">
                        <div className="big-stat">
                            <div className="stat-head type-smallcap">Best RSSI</div>
                            <div className="stat-body">
                                {props.bestRssi}
                                <span className="stat-unit"> dBm</span>
                            </div>
                        </div>

                        <div className="big-stat">
                            <div className="stat-head type-smallcap">SNR</div>
                            <div className="stat-body">
                                {props.snr}
                                <span className="stat-unit"></span>
                            </div>
                        </div>

                        <div className="big-stat">
                            <div className="stat-head type-smallcap">Redundancy</div>
                            <div className="stat-body">
                                {props.uplinks && hotspotCount()}
                                <span className="stat-unit"> Hotspots</span>
                            </div>
                        </div>

                        <div className="big-stat">
                            <div className="stat-head type-smallcap">Hex Updated</div>
                            <div className="stat-body">
                                {props.uplinks && recentTime().number}
                                <span className="stat-unit"> {props.uplinks && recentTime().unit} Ago</span>
                            </div>
                        </div>

                    </div>
                    <div className="hotspots-table-container">
                        <table className="hotspots-table">
                            <thead className="hotspot-table-head type-smallcap">
                                <tr>
                                    <th className="table-left" title="Helium hotspot that heard the mapping device">Hotspots</th>
                                    <th className="table-right" title="Received Signal Strength Indicator - an estimated measure of power recieved">RSSI</th>
                                    <th className="table-right" title="Signal to noise ratio">SNR</th>
                                    <th className="table-right" title="Distance between hotspot and surveyed hex">Dist</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.uplinks && props.uplinks.map(uplink => (
                                    <tr key={uplink.id}>
                                        <td className="table-left animal-cell">{deKebab(uplink.hotspot_name)}</td>
                                        <td className="table-right util-liga-mono tighten table-numeric">{uplink.rssi}<span className="table-unit"> dBm</span></td>
                                        <td className="table-right util-liga-mono tighten table-numeric">{uplink.snr.toFixed(2)}</td>
                                        <td className="table-right util-liga-mono tighten table-numeric">{uplinkDistance(uplink.lat, uplink.lng).number}<span className="table-unit"> {uplinkDistance(uplink.lat, uplink.lng).unit}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    );
}

export default InfoPane
