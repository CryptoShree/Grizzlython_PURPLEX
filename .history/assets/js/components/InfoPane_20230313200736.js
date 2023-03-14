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
                <svg className="mappers-logo" xmlns="http://www.w3.org/2000/svg" width="97" height="24" viewBox="0 0 97 24">
                    
                   
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.08398 5.22265C7.17671 5.08355 7.33282 5 7.5 5H18.5C18.6844 5 18.8538 5.10149 18.9408 5.26407C19.0278 5.42665 19.0183 5.62392 18.916 5.77735L16.916 8.77735C16.8233 8.91645 16.6672 9 16.5 9H5.5C5.3156 9 5.14617 8.89851 5.05916 8.73593C4.97215 8.57335 4.98169 8.37608 5.08398 8.22265L7.08398 5.22265ZM7.76759 6L6.43426 8H16.2324L17.5657 6H7.76759Z" fill="#47495F"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.08398 15.2226C7.17671 15.0836 7.33282 15 7.5 15H18.5C18.6844 15 18.8538 15.1015 18.9408 15.2641C19.0278 15.4267 19.0183 15.6239 18.916 15.7774L16.916 18.7774C16.8233 18.9164 16.6672 19 16.5 19H5.5C5.3156 19 5.14617 18.8985 5.05916 18.7359C4.97215 18.5734 4.98169 18.3761 5.08398 18.2226L7.08398 15.2226ZM7.76759 16L6.43426 18H16.2324L17.5657 16H7.76759Z" fill="#47495F"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.08398 13.7774C7.17671 13.9164 7.33282 14 7.5 14H18.5C18.6844 14 18.8538 13.8985 18.9408 13.7359C19.0278 13.5733 19.0183 13.3761 18.916 13.2226L16.916 10.2226C16.8233 10.0836 16.6672 10 16.5 10H5.5C5.3156 10 5.14617 10.1015 5.05916 10.2641C4.97215 10.4267 4.98169 10.6239 5.08398 10.7774L7.08398 13.7774ZM7.76759 13L6.43426 11H16.2324L17.5657 13H7.76759Z" fill="#47495F"/>
</svg>
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
