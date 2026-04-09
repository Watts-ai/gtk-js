use relm4::prelude::*;

pub struct ProgressbarTextCustom;

#[relm4::component(pub)]
impl SimpleComponent for ProgressbarTextCustom {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ProgressBar {
            set_fraction: 0.75,
            set_show_text: true,
            set_text: Some("Loading..."),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
