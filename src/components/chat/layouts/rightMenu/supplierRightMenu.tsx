import React, { useRef, useState, useEffect, useContext } 	from 'react'
import { useTranslation } 									from 'react-i18next'
import useOutsideClick 										from '../../hooks/useOutsideClick'
import DefaultAccordion 									from '../../accordion/defaultAccordion'
import InfoUser 											from '../../profiles/infoUser'
import { PartnerContext } 									from './../../context/centerContext';
// import EditNote 											from '../../card/message/editNote'

interface RightMenuProps {
	show: boolean
	setShowRightMenu: any
	rightMenuData?: {
		[key: string]: any
	}
}

const SupplierRightMenu: React.FC<RightMenuProps> = ({ show, setShowRightMenu, rightMenuData }) => {
	const { t } = useTranslation()
	const { partner }						= useContext(PartnerContext);
	const [showSection1, setShowSection1] 	= useState<boolean>(false)
	// const [showSection2, setShowSection2] = useState<boolean>(false)
	const [showSection3, setShowSection3] 	= useState<boolean>(false)
	// const [showSection4, setShowSection4] = useState<boolean>(false)
	const [showSection5, setShowSection5] 	= useState<boolean>(false)
	const [showSection6, setShowSection6] 	= useState<boolean>(false)

	// const editNoteData: string[] = [
	// 	'อีแต๋นลาเต้ เอ๋อดีกรี พาสตามาร์เก็ตติ้งแต๋วดิสเครดิต แมคเคอเรลคอนโดคาเฟ่',
	// 	'นิวไทเฮาออดิทอเรียมวิป เพลย์บอย จิ๊ก ตรวจทานแฮนด์เซอร์วิส',
	// ]
	// const editNoteData2: string[] = []

	const ref = useRef<HTMLDivElement>(null)

	useOutsideClick(ref, () => {
		if (window.innerWidth < 1200) {
			setShowRightMenu(!show)
		}
	})

	useEffect(() => {
		const handleWindowResize = () => {
			if (window.innerWidth > 1300) {
				setShowRightMenu(true)
			} else {
				setShowRightMenu(false)
			}
		}

		window.addEventListener('resize', handleWindowResize)

		return () => {
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [setShowRightMenu])

	return (
		<div>
			<div
				ref={show === true ? ref : null}
				className={`nk-chat-profile  ${show ? 'visible' : ''}`}
				data-simplebar="init">
				<div
					className="simplebar-wrapper"
					// style="margin: 0px;"
				>
					<div className="simplebar-height-auto-observer-wrapper">
						<div className="simplebar-height-auto-observer"></div>
					</div>
					<div className="simplebar-mask">
						<div
							className="simplebar-offset"
							// style="right: 0px; bottom: 0px;"
						>
							<div
								className="simplebar-content-wrapper overflow-scroll scroll_gray"
								tabIndex={0}
								role="region"
								aria-label="scrollable content"
								style={{ maxHeight: '100vh' }}>
								<div
									className="simplebar-content"
									// style="padding: 0px;"
								>
									<div className="nk-chat-right">
										<InfoUser 
											data={{
												userId        : partner.userId,
												firstName     : partner.firstName,
												lastName      : partner.lastName,
												email         : partner.email,
												image         : partner.image,
												last_message  : '',
												userType      : partner.userType,
												time          : ''
											}} 
											status={partner.status} 
											type='top' 
										/>
									</div>
									<div className="user-card user-card-s2">
										<div className="d-flex justify-content-center">
											<div className="p-1">
												<button type="button" className="btn btn-sm btn btn-outline-light">
													<em className="icon ni ni-question-alt fw-bold"></em>
												</button>
											</div>
											<div className="p-1">
												<button type="button" className="btn btn-sm btn btn-outline-light">
													<em className="icon ni ni-star fw-bold"></em>
												</button>
											</div>
											<div className="p-1">
												<button type="button" className="btn btn-sm btn-view-profile-c-3 w-100">
													{t('viewProfile')}
												</button>
											</div>
										</div>
									</div>
									<div className="chat-profile">
										<DefaultAccordion
											show={showSection1}
											setShow={setShowSection1}
											title={t('basicInformation')}
											icon={'icon ni ni-user-alt fw-bold'}>
											<div className="chat-profile-status">
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('status')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">
															<span className="badge span-online-personal">
																<i className="status dot dot-text-lg dot-text-success"></i>
																<small className="text-status">{t('online')}</small>
															</span>
														</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">Company Name:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">บริษัท จินดาสยาม จำกัด</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">Position:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">Sale</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">Brief Info:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">สัั่งสินค้า 100 ชิ้น</label>
													</div>
												</div>
											</div>
										</DefaultAccordion>

										{/* <DefaultAccordion
											show={showSection2}
											setShow={setShowSection2}
											title={t('tags')}
											icon={'icon ni ni-label fw-bold'}>
											<div className="chat-profile-body-inner">
												<ul className="chat-profile-settings">
													<li>
														<a className="chat-option-link" href={'/'}>
															<em className="icon icon-circle bg-light ni ni-alert-fill"></em>
															<div>
																<span className="lead-text">Something Wrong</span>
																<span className="sub-text">
																	Give feedback and report conversion.
																</span>
															</div>
														</a>
													</li>
												</ul>
											</div>
										</DefaultAccordion> */}
										<DefaultAccordion
											show={showSection3}
											setShow={setShowSection3}
											title={t('selectProductionOrder')}
											icon={'icon ni ni-todo fw-bold'}>
											<div className="iv-doc-label pb-5">
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('productionOrderNumber')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<select
															className="form-select form-select-sm rounded-pill"
															aria-label=".form-select-sm"
															defaultValue={'0'}>
															<option value={'0'}>IV123456789</option>
														</select>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('purchaseOrderStatus')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">ออเดอร์ถูกสร้าง</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('purchaseOrderCreationDate')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">12.12.2022 20:00:15</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('grossPrice')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">40,000 {t('baht')}</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('numberOfProducts')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">2 {t('products')}</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('proposedNumberOfFactories')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">40 {t('factory')}</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('selectedPlant')}:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">-</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">{t('netPrice')}</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">-</label>
													</div>
												</div>
												<div className="row">
													<div className="col-md-12 d-flex align-items-center justify-content-center">
														<a href={'/'} className="iv-link">
															{t('viewOrderDetails')}{' '}
															<em className="icon ni ni-arrow-right-circle-fill"></em>
														</a>
													</div>
													<div className="col-md-12 d-flex align-items-center justify-content-center">
														<button type="button" className="btn btn-view-profile-c-2 w-100">
															{t('sendANewQuote')}
														</button>
													</div>
												</div>
											</div>
										</DefaultAccordion>

										{/* <DefaultAccordion
											show={showSection4}
											setShow={setShowSection4}
											title={t('selectEditNote')}
											icon={'icon ni ni-todo fw-bold'}>
											<div className="edit-note-container">
												<EditNote
													type="message"
													who={'you'}
													name={'Admin 01'}
													data={editNoteData}
													datetime={new Date()}
													image={'/assets/images/avatar/c-sm.jpg'}
												/>
												<EditNote
													type="message"
													who={'you'}
													name={'Admin 02'}
													data={editNoteData2}
													datetime={new Date()}
													image={'/assets/images/avatar/j-sm.jpg'}
												/>
											</div>
										</DefaultAccordion> */}

										<DefaultAccordion
											show={showSection5}
											setShow={setShowSection5}
											title={'History'}
											icon={'icon ni ni-todo fw-bold'}>
											<div style={{ padding: '1rem 2.5rem' }}>
												<div className="row border py-2 rounded mb-2">
													<div className="col-12">
														<div style={{ fontSize: '14px', fontWeight: 600 }}>
															บริษัท จินดาสยาม จำกัด: (20-09-2020)
														</div>
													</div>
													<div className="col-12">
														<div style={{ fontSize: '14px', color: '#c6c5c5' }}>
															This is an example of message history
														</div>
													</div>
												</div>
												<div className="row border py-2 rounded">
													<div className="col-12">
														<div style={{ fontSize: '14px', fontWeight: 600 }}>
															บริษัท จินดาสยาม จำกัด: (18-09-2020)
														</div>
													</div>
													<div className="col-12">
														<div style={{ fontSize: '14px', color: '#c6c5c5' }}>
															This is an example of message history
														</div>
													</div>
												</div>
											</div>
										</DefaultAccordion>

										<DefaultAccordion
											show={showSection6}
											setShow={setShowSection6}
											title={'Tax Information'}
											icon={'icon ni ni-todo fw-bold'}>
											<div className="chat-profile-status" style={{ height: 500 }}>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">Company Name:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">บริษัท จินดาสยาม จำกัด</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">Tax ID:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">0-9940-00164-17-3</label>
													</div>
												</div>
												<div className="row">
													<div className="col-6 d-flex align-items-center">
														<label className="title">Address:</label>
													</div>
													<div className="col-6 d-flex align-items-center">
														<label className="data">
															618/1 ถ.มักกะสัน แขวงมักกะสัน เขตราชเทวี กทม. 10400
														</label>
													</div>
													<div className="col-12 d-flex align-items-center justify-content-center mt-2">
														<button type="button" className="btn btn-sm btn-view-profile-c-3 w-100">
															ขอรายละเอียดเพิ่มเติม
														</button>
													</div>
												</div>
											</div>
										</DefaultAccordion>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="simplebar-placeholder"></div>
				</div>
				<div className="simplebar-track simplebar-horizontal">
					<div className="simplebar-scrollbar"></div>
				</div>
				<div className="simplebar-track simplebar-vertical">
					<div className="simplebar-scrollbar"></div>
				</div>
			</div>
			{show && <div className="nk-chat-profile-overlay "></div>}
		</div>
	)
}

export default SupplierRightMenu
