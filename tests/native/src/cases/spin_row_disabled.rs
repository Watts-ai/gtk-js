use relm4::adw;
use relm4::adw::prelude::*;
use relm4::gtk;
use relm4::prelude::*;

pub struct SpinRowDisabled;

#[relm4::component(pub)]
impl SimpleComponent for SpinRowDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::SpinRow {
            set_title: "Spin Row",
            set_adjustment: Some(&gtk::Adjustment::new(50.0, 0.0, 100.0, 1.0, 10.0, 0.0)),
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
