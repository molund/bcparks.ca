import React, { useState, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { parseJSON, format } from "date-fns"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import blueAlertIcon from "../../images/park/blue-alert.svg"
import redAlertIcon from "../../images/park/red-alert.svg"
import yellowAlertIcon from "../../images/park/yellow-alert.svg"

import "../../styles/advisories/advisoryDetails.scss"

const formatDate = isoDate => {
  return isoDate ? format(parseJSON(isoDate), "MMMM d, yyyy") : ""
}

export default function AdvisoryDetails({ advisories, parkType, parkAccessStatus }) {
  advisories.sort((a, b) => {
    return b.listingRank - a.listingRank
      || b?.urgency?.sequence - a?.urgency?.sequence
      || new Date(b.advisoryDate) - new Date(a.advisoryDate)
  })

  const [openAccordions, setOpenAccordions] = useState({})

  const advisoriesWithFormatting = advisories.map(advisory => {
    let alertIcon
    let alertColorCss
    switch (advisory.urgency.color) {
      case "blue":
        alertIcon = blueAlertIcon
        alertColorCss = "blue-alert"
        break
      case "red":
        alertIcon = redAlertIcon
        alertColorCss = "red-alert"
        break
      case "yellow":
        alertIcon = yellowAlertIcon
        alertColorCss = "yellow-alert"
        break
      default:
        alertIcon = blueAlertIcon
        alertColorCss = "blue-alert"
    }

    return {
      alertIcon,
      alertColorCss,
      formattedAdvisoryDate: formatDate(advisory.advisoryDate),
      formattedEffectiveDate: formatDate(advisory.effectiveDate),
      formattedEndDate: formatDate(advisory.endDate),
      formattedUpdatedDate: formatDate(advisory.updatedDate),
      ...advisory,
    }
  })

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const toggleExpandAll = () => {
    const newExpandAll = !allExpanded
    const newOpenAccordions = advisoriesWithFormatting.reduce((acc, _, index) => {
      acc[index] = newExpandAll
      return acc
    }, {})
    setOpenAccordions(newOpenAccordions)
  }

  const allExpanded = useMemo(() => {
    return advisoriesWithFormatting.length > 0 &&
      Object.keys(openAccordions).length === advisoriesWithFormatting.length &&
      Object.values(openAccordions).every((isOpen) => isOpen)
  }, [openAccordions, advisoriesWithFormatting.length])

  useEffect(() => {
    if (advisoriesWithFormatting.length === 1 && parkAccessStatus !== null) {
      setOpenAccordions({ 0: true })
    }
  }, [advisoriesWithFormatting.length, parkAccessStatus])

  return (
    <div id="advisories">
      {/* id="park-advisory-details-container" should be removed once it's removed from the contents */}
      <h3 id="park-advisory-details-container">
        {`Advisories (${advisories.length})`}
      </h3>
      <Row>
        {advisoriesWithFormatting.length === 0 && (
          <Col>
            <p>
              There are no reported advisories for this {parkType}
            </p>
          </Col>
        )}
        {advisoriesWithFormatting.length > 0 && (
          <Col>
            {advisoriesWithFormatting.length > 1 && (
              <button
                onClick={toggleExpandAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toggleExpandAll()
                  }
                }}
                className="btn btn-link expand-link expand-icon"
              >
                {allExpanded ?
                  <>Collapse all <FontAwesomeIcon icon={faChevronUp} /></>
                  :
                  <>Expand all <FontAwesomeIcon icon={faChevronDown} /></>
                }
              </button>
            )}
            {advisoriesWithFormatting.map((advisory, index) => (
              <Accordion
                key={index}
                className={`advisory-accordion is-open--${openAccordions[index]}`}
              >
                <Accordion.Toggle
                  as={"div"}
                  className="accordion-toggle"
                  eventKey={index.toString()}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        src={advisory.alertIcon}
                        alt="advisory status icon"
                        className="advisory-status-icon"
                      ></img>
                      <HtmlContent className="accordion-header">{advisory.title}</HtmlContent>
                    </div>
                    <div className="d-flex align-items-center">
                      {openAccordions[index] ?
                        <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
                      }
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()} in={openAccordions[index]}>
                  <div className="accordion-content">
                    {advisory.description && (
                      <HtmlContent className="mb-2">
                        {advisory.description}
                      </HtmlContent>
                    )}
                    {advisory.links?.map(({ title, url, id }) => (
                      <p key={id}>
                        <a
                          href={url}
                          style={{ display: 'block' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {title}
                        </a>
                      </p>
                    ))}
                    {advisory.isEffectiveDateDisplayed &&
                      advisory.formattedEffectiveDate && (
                        <p>
                          In effect {advisory.formattedEffectiveDate}
                          {advisory.isEndDateDisplayed &&
                            advisory.formattedEndDate && (
                              <>
                                {" to "}
                                {advisory.formattedEndDate}
                              </>
                            )}
                        </p>
                      )}
                    {advisory.isAdvisoryDateDisplayed &&
                      advisory.formattedAdvisoryDate && (
                        <p>Posted {advisory.formattedAdvisoryDate}</p>
                      )}
                    {advisory.isUpdatedDateDisplayed &&
                      advisory.formattedUpdatedDate && (
                        <p>Updated {advisory.formattedUpdatedDate}</p>
                      )}
                  </div>
                </Accordion.Collapse>
              </Accordion>
            ))}
          </Col>
        )}
      </Row>
    </div>
  )
}

AdvisoryDetails.propTypes = {
  advisories: PropTypes.array.isRequired,
  parkType: PropTypes.string,
}
