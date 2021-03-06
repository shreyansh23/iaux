import React from 'react';
import IAReactComponent from '../IAReactComponent';
import ACUtil from "@internetarchive/dweb-archivecontroller/Util";
import AnchorDownload from "@internetarchive/ia-components/sandbox/details/AnchorDownload";

export default class DetailsDownloadOptions extends IAReactComponent {

    constructor(props) {
        super(props); //identifier, files_count, files=[ArchiveFile*] or array of any object that has metadata{format, name, source} and downloadable()
    }

    render() {
        // Build a dictionary of file formats
        const downloadableFilesDict = this.props.files.reduce( (res, af) => {
                if (af.downloadable()) {  // Note on image it EXCLUDED JPEG Thumb, but included JPEG*Thumb
                    const format = af.metadata.format;
                    if (!res[format]) { res[format] = []; }
                    res[format].push(af);
                }
                return res;
            }, {}
        );
        const compressURL = `https://archive.org/compress/${this.props.identifier}`; // leave as direct link, else need to zip and store each item in IPFS
        const filesCount = this.props.files_count;
        const originalFilesCount = this.props.files.filter((f)=>f.metadata.source === "original").length+1; // Adds in Archive BitTorrent
        const compressAllURL = `https://archive.org/compress/${this.props.identifier}/formats=JSON,METADATA,JPEG,ARCHIVE BITTORRENT,MUSICBRAINZ METADATA`; // As above leave as direct

        return (
            <section className="boxy item-download-options">
                <div className="download-button" role="heading" aria-level="5">DOWNLOAD OPTIONS</div>
                {Object.keys(downloadableFilesDict).map(k => (
                    <div className="format-group" key={k}>
                        <div className="summary-rite">
                            <AnchorDownload className="stealth" identifier={this.props.identifier} format={k} source={downloadableFilesDict[k]} title={k}>
                                <span className="hover-badge-stealth"><span className="iconochive-download" aria-hidden="true"></span><span
                                className="sr-only">download</span>{downloadableFilesDict[k].length} files</span>
                            </AnchorDownload>
                        </div>
                        {/*TODO on archive.org this pops up when hovered over */}
                        <AnchorDownload className="format-summary download-pill" identifier={this.props.identifier} format={k}
                           source={downloadableFilesDict[k]}
                           title={k}
                           data-toggle="tooltip" data-placement="auto left" data-container="body"
                           target="_blank">
                            {ACUtil.formats("format", k).downloadable} <span className="iconochive-download"
                                                                              aria-hidden="true"></span><span
                                className="sr-only">download</span>
                        </AnchorDownload>
                    </div>

                ))}
                <div className="show-all">
                    <div className="pull-right">
                        <a className="boxy-ttl hover-badge" href={compressURL}><span className="iconochive-download"
                                                                                     aria-hidden="true"></span><span
                            className="sr-only">download</span> {filesCount} Files</a><br/>
                        <a className="boxy-ttl hover-badge" href={compressAllURL}><span className="iconochive-download"
                                                                                        aria-hidden="true"></span><span
                            className="sr-only">download</span> {originalFilesCount} Original</a><br/>
                    </div>
                    <AnchorDownload className="boxy-ttl" identifier={this.props.identifier}>SHOW ALL</AnchorDownload>
                    <br clear="all" className="clearfix"/>
                </div>
            </section>
        );
    }
}


