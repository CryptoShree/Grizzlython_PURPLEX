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
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C18.6274 0 24 5.37257 24 12C24 18.6274 18.6274 24 12 24C5.37257 24 0 18.6274 0 12C0 5.37257 5.37257 0 12 0ZM18.3937 9.44629C18.6933 9.14655 18.9186 8.78087 19.0515 8.37848C19.1844 7.97609 19.2213 7.54818 19.1593 7.12897C19.0972 6.70976 18.9379 6.3109 18.6941 5.9643C18.4502 5.61769 18.1287 5.33297 17.7551 5.13291C17.3815 4.93284 16.9663 4.82299 16.5426 4.81214C16.119 4.80129 15.6987 4.88975 15.3154 5.07043C14.9321 5.25111 14.5963 5.519 14.3351 5.85267C14.0738 6.18634 13.8943 6.57652 13.8109 6.992C11.8886 6.268 9.68286 6.728 8.21486 8.19657C6.74514 9.66571 6.28571 11.8737 7.012 13.7983C6.52886 13.8936 6.08074 14.1186 5.71561 14.449C5.35048 14.7794 5.08208 15.203 4.93915 15.6742C4.79622 16.1455 4.78413 16.6467 4.90418 17.1243C5.02424 17.6019 5.27191 18.0379 5.62069 18.3855C5.96947 18.7332 6.40623 18.9795 6.88421 19.098C7.3622 19.2165 7.86341 19.2028 8.33421 19.0583C8.805 18.9139 9.22765 18.6441 9.55691 18.2779C9.88617 17.9117 10.1097 17.4629 10.2034 16.9794C11.1524 17.3319 12.1824 17.405 13.1716 17.1902C14.1609 16.9754 15.0678 16.4817 15.7851 15.7674C17.248 14.304 17.7109 12.1091 16.9977 10.1909C17.5269 10.0875 18.0131 9.82816 18.3937 9.44629ZM15.1897 6.24229C15.5262 5.90639 15.9823 5.71774 16.4577 5.71774C16.9332 5.71774 17.3892 5.90639 17.7257 6.24229C18.0616 6.57889 18.2503 7.03502 18.2503 7.51057C18.2503 7.98613 18.0616 8.44225 17.7257 8.77886C17.5293 8.97673 17.2892 9.12569 17.0247 9.21373C16.7602 9.30177 16.4787 9.32643 16.2029 9.28572C16.1765 9.28227 16.1498 9.28227 16.1234 9.28572C15.9147 9.25829 15.7028 9.30322 15.5231 9.41302C15.3435 9.52281 15.2068 9.69085 15.136 9.88914C15.0566 10.1103 15.0606 10.3606 15.1669 10.5903C15.4602 11.2285 15.5514 11.9411 15.4284 12.6327C15.3053 13.3242 14.9738 13.9616 14.4783 14.4594C13.9804 14.9552 13.3428 15.2868 12.651 15.4099C11.9592 15.533 11.2464 15.4416 10.608 15.148C10.4974 15.0967 10.3777 15.0678 10.2559 15.0631C10.1341 15.0584 10.0125 15.0779 9.89829 15.1206C9.71077 15.1897 9.55083 15.318 9.44259 15.486C9.33436 15.654 9.28371 15.8527 9.29829 16.052C9.29368 16.0825 9.29368 16.1135 9.29829 16.144C9.34476 16.4257 9.32355 16.7143 9.23641 16.9862C9.14927 17.2581 8.9987 17.5053 8.79714 17.7074C8.46049 18.043 8.00451 18.2315 7.52914 18.2315C7.05378 18.2315 6.5978 18.043 6.26114 17.7074C6.09405 17.5413 5.96156 17.3437 5.87132 17.1261C5.78108 16.9084 5.73489 16.675 5.73543 16.4394C5.73543 15.9606 5.92229 15.5097 6.26114 15.1709C6.66343 14.7686 7.21886 14.584 7.81257 14.6651C7.87257 14.6771 7.93314 14.6857 7.99486 14.6857C8.18221 14.6858 8.36515 14.6289 8.51931 14.5224C8.67346 14.4159 8.79151 14.265 8.85771 14.0897C8.94343 13.8651 8.94172 13.608 8.83314 13.3731C8.53976 12.7348 8.44849 12.0221 8.57156 11.3305C8.69463 10.6388 9.02615 10.0013 9.52172 9.50343C10.0196 9.00768 10.6572 8.67603 11.349 8.55295C12.0408 8.42988 12.7536 8.52127 13.392 8.81486C13.6234 8.92229 13.8771 8.92571 14.0994 8.84343C14.3046 8.76842 14.4765 8.62296 14.5844 8.433C14.6923 8.24305 14.7292 8.02094 14.6886 7.80629C14.642 7.52453 14.6631 7.23572 14.7502 6.96376C14.8374 6.69179 14.988 6.44448 15.1897 6.24229ZM13.4183 13.3994C13.6057 13.2156 13.7547 12.9964 13.8569 12.7546C13.9591 12.5128 14.0123 12.2532 14.0136 11.9907C14.0148 11.7282 13.964 11.468 13.8641 11.2253C13.7643 10.9825 13.6173 10.762 13.4317 10.5763C13.246 10.3907 13.0255 10.2437 12.7827 10.1439C12.54 10.044 12.2798 9.99319 12.0173 9.99443C11.7548 9.99567 11.4952 10.0489 11.2534 10.1511C11.0116 10.2533 10.7924 10.4023 10.6086 10.5897C10.2465 10.9644 10.046 11.4663 10.0504 11.9873C10.0548 12.5084 10.2637 13.0068 10.6321 13.3753C11.0005 13.7438 11.499 13.9528 12.02 13.9573C12.541 13.9618 13.043 13.7615 13.4177 13.3994H13.4183Z" />
 
<g transform="translate(0.000000,201.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M2059 1405 c-104 -33 -201 -128 -236 -230 -20 -57 -22 -161 -5 -220 19 -66 74 -147 127 -187 148 -113 349 -98 480 36 72 75 99 143 99 256 0 75 -4 93 -32 151 -60 125 -174 200 -312 206 -47 2 -92 -3 -121 -12z m223 -35 c73 -27 151 -102 184 -176 54 -118 28 -280 -58 -365 -56 -55 -75 -68 -138 -89 -71 -24 -110 -25 -184 -6 -126 33 -221 135 -246 264 -18 91 15 213 78 283 84 94 245 134 364 89z"/> <path d="M2251 1288 c-23 -11 -41 -24 -41 -28 0 -4 -27 -11 -60 -15 -99 -11 -163 -78 -175 -182 -3 -23 -16 -59 -30 -79 -30 -44 -32 -78 -5 -122 34 -56 108 -69 157 -28 17 15 48 27 73 30 103 12 179 83 180 167 0 22 11 52 29 80 44 66 45 104 4 149 -41 44 -82 53 -132 28z m88 -23 c58 -29 61 -105 7 -141 -23 -14 -25 -21 -20 -55 5 -28 1 -50 -16 -83 -28 -59 -77 -89 -144 -90 -43 -1 -55 -5 -77 -30 -18 -21 -35 -29 -58 -29 -75 0 -111 96 -53 145 23 19 27 31 27 74 0 97 87 176 179 161 28 -4 36 -1 46 18 12 23 43 43 68 44 7 1 26 -6 41 -14z"/> <path d="M2262 1228 c-6 -7 -12 -26 -14 -43 -3 -30 -3 -30 -61 -27 -54 4 -59 2 -93 -32 -33 -33 -35 -38 -32 -93 3 -58 3 -58 -27 -61 -40 -5 -55 -19 -55 -51 0 -34 17 -51 51 -51 32 0 46 15 51 55 3 30 3 30 66 30 60 0 66 2 94 34 27 30 29 39 26 90 -3 56 -3 56 27 59 17 2 36 8 43 14 15 13 16 60 0 76 -16 16 -63 15 -76 0z m-55 -132 c24 -21 26 -27 18 -52 -6 -16 -22 -35 -36 -43 -24 -13 -29 -13 -53 2 -34 23 -37 78 -4 101 30 21 42 20 75 -8z"/> <path d="M740 1333 l-286 -3 -63 -61 c-35 -33 -61 -62 -58 -65 3 -3 137 -5 299 -4 l293 1 62 61 c34 34 60 65 57 70 -3 4 -8 7 -12 6 -4 -2 -135 -4 -292 -5z m230 -33 c0 -15 -42 -60 -56 -60 -8 0 -14 -3 -14 -7 0 -13 -479 -13 -487 -1 -3 7 10 26 32 45 l39 34 243 -2 c134 -1 243 -5 243 -9z"/> <path d="M1285 1211 l-29 -31 62 -63 63 -63 -61 -58 -61 -59 23 -26 c13 -14 24 -28 26 -30 1 -3 31 23 66 58 l63 62 61 -63 61 -63 30 31 31 31 -64 59 -64 59 61 62 61 63 -27 28 -28 29 -60 -63 -61 -62 -61 65 -62 65 -30 -31z m77 -64 c18 -18 45 -38 59 -44 24 -10 31 -7 74 28 68 56 74 53 20 -11 -43 -52 -44 -82 -5 -122 17 -16 30 -34 30 -39 0 -5 5 -9 10 -9 6 0 10 -5 10 -11 0 -6 -18 5 -39 24 -74 67 -84 67 -163 5 -45 -35 -50 -27 -9 13 26 25 41 51 47 86 1 7 -18 33 -42 58 -24 25 -44 48 -44 50 0 14 23 1 52 -28z"/> <path d="M330 1121 c0 -5 28 -36 63 -70 l62 -61 298 0 c163 0 297 2 297 4 0 2 -30 34 -67 70 l-68 66 -292 0 c-168 0 -293 -4 -293 -9z m612 -58 c17 -18 30 -35 27 -38 -10 -9 -453 -12 -488 -2 -35 9 -70 41 -71 64 0 10 56 12 250 10 l250 -2 32 -32z"/> <path d="M393 856 c-35 -33 -63 -63 -63 -68 0 -4 134 -8 298 -8 l298 0 64 65 c35 36 60 65 55 65 -6 1 -140 2 -300 3 l-290 2 -62 -59z m556 26 l22 -8 -21 -27 c-12 -14 -38 -31 -58 -36 -43 -10 -477 -10 -487 1 -4 4 9 22 30 41 l37 34 227 2 c126 1 238 -2 250 -7z"/> </g> </svg> 
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
